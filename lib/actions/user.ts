"use server";

import { auth, signIn, signOut } from "@/app/auth";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import nodemailer from "nodemailer";
import prisma from "../prisma";
import { User } from "@prisma/client";
import {
    IAdminUser,
    State,
    UserCustomer,
    UserEmployee,
    UserNoPassword,
} from "../definitions";
import {
    customerSchema,
    loginSchema,
    resetPasswordSchema,
    userSchema,
} from "../schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { generateVerificationToken } from "./tokens";
import bcrypt from "bcrypt";
import { sendResetPasswordEmail, sendVerificationEmail } from "../mail";
import { generateResetPasswordToken } from "./reset-password";
import { isUserAdult } from "../utils";

// auth
export async function authenticate(
    prevState: State | undefined,
    formData: FormData
) {
    const parsedCredentials = loginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });
    if (!parsedCredentials.success) {
        return {
            errors: parsedCredentials.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to log in.",
            success: false,
        };
    }
    const { email, password } = parsedCredentials.data;
    try {
        const user = await getEmployee(email);
        if (!user || !user.email || !user.password) {
            return {
                errors: {},
                message: "Email does not exist.",
                success: false,
            };
        }
        const passwordsMatch = await bcrypt.compare(
            password,
            user.password as string
        );
        if (!passwordsMatch) {
            return {
                errors: {},
                message: "Email or Password mismatch!",
                success: false,
            };
        }
        if (!user.emailVerified) {
            const verificationToken = await generateVerificationToken(
                user.email
            );
            await sendVerificationEmail(
                verificationToken.email,
                verificationToken.token
            );
            return {
                errors: {},
                message: "Confirm email sent!",
                success: true,
            };
        }

        await signIn("credentials", formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return {
                        message: "Invalid credentials.",
                        errors: {},
                        success: false,
                    };
                default:
                    return {
                        message: "Something went wrong.",
                        errors: {},
                        success: false,
                    };
            }
        }
        throw error;
    }
}
const RegisterUser = userSchema;

export async function register(prevState: FormData, formData: FormData) {
    const validatedFields = RegisterUser.safeParse({
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        password: formData.get("password"),
    });
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to register User.",
        };
    }
    // Prepare data for insertion into the database
    const { firstName, lastName, email, password } = validatedFields.data;

    try {
        const userExisted = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (userExisted) {
            throw new Error("User with this email already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName: firstName,
                lastName: lastName,
                employee: {
                    create: {
                        salary: 500,
                        role: "EMPLOYEE",
                    },
                },
            },
        });
    } catch (error) {
        // If a database error occurs, return a more specific error.
        return {
            message: "Database Error: Failed to register User." + error,
        };
    }
    revalidatePath("/dashboard");
    redirect("/auth/login-credentials");
}

export async function resetPassword(
    prevState: State | undefined,
    formData: FormData
) {
    const parsedCredentials = resetPasswordSchema.safeParse({
        email: formData.get("email"),
    });
    if (!parsedCredentials.success) {
        return {
            errors: parsedCredentials.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to reset password.",
            success: false,
        };
    }
    const { email } = parsedCredentials.data;
    try {
        const user = await getEmployee(email);
        if (!user || !user.email || !user.password) {
            return {
                errors: {},
                message: "Email does not exist.",
                success: false,
            };
        }

        const resetPasswordToken = await generateResetPasswordToken(email);
        await sendResetPasswordEmail(
            resetPasswordToken.email,
            resetPasswordToken.token
        );
        return {
            errors: {},
            message: "Reset email sent!",
            success: true,
        };
    } catch (error) {
        return {
            errors: {},
            message: "Missing Fields. Failed to reset password.",
            success: false,
        };
    }
}
export async function sendEmailForgetPassword(
    form: string,
    subject: string,
    body: string
) {
    const message = {
        from: form,
        to: process.env.GMAIL_EMAIL_ADDRESS,
        subject: subject,
        text: body,
        // html: `<p>${req.body.message}</p>`,
    };

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_EMAIL_ADDRESS,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });
}
export async function logOut() {
    await signOut();
}

export async function getUserById(id: string): Promise<User | null> {
    try {
        const user = await prisma.user.findUnique({ where: { id: id } });
        return user;
    } catch (error) {
        throw new Error("Error at get user by id" + error);
    }
}

export async function protectedAction() {
    const authData = await auth();
    if (!authData || !authData.user) {
        // not authenticated
        redirect("/api/auth/sigin");
    }

    const {
        user: { email },
    } = authData;
    try {
        const user = await getUserByEmail(email as string);
        if (!user) {
            throw new Error("User not found !!!");
        }
        return user;
    } catch (error) {
        throw new Error("Interval server error" + error);
    }
}
export async function getUserByEmail(
    email: string
): Promise<UserNoPassword | null> {
    if (!email) {
        throw new Error("Missting user id for get user");
    }
    try {
        // get everything excepted password
        const user = await prisma.user.findUnique({
            where: { email: email },

            select: {
                address: true,
                billingAddress1: true,
                billingAddress2: true,
                shippingAddress: true,
                cart: true,
                createdAt: true,
                dateOfBirth: true,
                description: true,
                email: true,
                emailVerified: true,
                employee: true,
                favoriteProduct: true,
                favoriteProductIds: true,
                firstName: true,
                gender: true,
                id: true,
                image: true,
                kind: true,
                lastName: true,
                name: true,
                orders: true,
                phoneNumber: true,
                phoneVerified: true,
                score: true,
                updatedAt: true,
            },
        });
        return user;
    } catch (error) {
        throw new Error("Error getting user" + error);
    }
}
export async function getUserAdmin(email: string): Promise<IAdminUser | null> {
    if (!email) {
        throw new Error("Missting user id for get user");
    }
    try {
        // get everything excepted password
        const user = await prisma.user.findUnique({
            where: { email: email },

            select: {
                email: true,
                employee: true,

                firstName: true,
                gender: true,
                id: true,
                image: true,
                kind: true,
                lastName: true,
                name: true,
            },
        });
        return user;
    } catch (error) {
        throw new Error("Error getting user" + error);
    }
}
export async function getEmployeeById(
    id: string
): Promise<UserEmployee | null> {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
                employee: {
                    NOT: {
                        userId: undefined,
                    },
                },
            },
            include: {
                employee: true,
            },
        });

        return user;
    } catch (error) {
        console.error("Failed to fetch user:", error);
        throw new Error("Failed to fetch user.");
    }
}

export async function getUserRole() {
    const sesstion = await auth();
    if (!sesstion || !sesstion.user) {
        redirect("/auth/login-credentials");
    }
    try {
        const user = await getEmployee(sesstion.user.email as string);
        if (!user || !user.employee) return null;
        return user.employee.role;
    } catch (error) {
        throw new Error("Error: " + error);
    }
}

// customer
export async function createCustomer(prevState: State, formData: FormData) {
    const validatedFields = customerSchema.safeParse({
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        gender: formData.get("gender"),
        dateOfBirth: formData.get("dateOfBirth"),
        phoneNumber: formData.get("phoneNumber"),
        country: formData.get("country"),
        state: formData.get("state"),
        city: formData.get("city"),
        addressLine: formData.get("addressLine"),
        postalCode: formData.get("postalCode"),
    });

    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);

        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to create customer.",
        };
    }

    const {
        firstName,
        lastName,
        email,
        gender,
        dateOfBirth,
        phoneNumber,
        addressLine,
        city,
        country,
        postalCode,
        state,
    } = validatedFields.data;

    try {
        const existedUser = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (existedUser) {
            return {
                errors: {},
                message: "Email is already in use, please use the new email",
            };
        }
        if (!isUserAdult(dateOfBirth)) {
            return {
                errors: {},
                message: "You are not allowed",
            };
        }
        // now create the customer as a user with password default
        // after can send email to required reset password
        await prisma.user.create({
            data: {
                firstName,
                email,
                lastName,
                gender,
                dateOfBirth,
                phoneNumber,
                password: "123456",
                address: {
                    create: {
                        addressLine: addressLine || "",
                        country: country || "",
                        postalCode: postalCode || "",
                        city: city,
                        state: state,
                    },
                },
            },
        });
    } catch (error) {
        throw new Error("Error creating customer" + error);
    }
    revalidatePath("/dashboard/customers/create");
    redirect("/dashboard/customers/create");
}
export async function getCustomersDetail() {
    try {
        const customers = await prisma.user.findMany({
            // where: {
            //     employee: null,
            // },
            include: {
                address: true,
                orders: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return customers as UserCustomer[];
    } catch (error) {
        throw new Error("Error at get customers detail" + error);
    }
}
export async function getCustomerById(id: string) {
    try {
        const customer = await prisma.user.findUnique({
            where: {
                id: id,
            },
            include: {
                address: true,
                orders: {
                    orderBy: {
                        completedAt: "desc",
                    },
                },
            },
        });
        return customer as UserCustomer;
    } catch (error) {
        throw new Error("Error at get customers detail" + error);
    }
}
export async function getCustomers() {
    try {
        const customers = await prisma.user.findMany({
            orderBy: {
                firstName: "desc",
            },
        });
        return customers as User[];
    } catch (error) {
        throw new Error("Error at get customers" + error);
    }
}

//employee
export async function getEmployee(
    email: string
): Promise<UserEmployee | undefined> {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
                employee: {
                    NOT: {
                        userId: undefined,
                    },
                },
            },
            include: {
                employee: true,
            },
        });

        return user as UserEmployee;
    } catch (error) {
        console.error("Failed to fetch user:", error);
        throw new Error("Failed to fetch user.");
    }
}
export async function getEmployees(): Promise<UserEmployee[] | undefined> {
    try {
        const user = await prisma.user.findMany({
            where: {
                employee: {
                    NOT: {
                        userId: undefined,
                    },
                },
            },
            include: {
                employee: true,
            },
        });

        return user as UserEmployee[];
    } catch (error) {
        console.error("Failed to fetch user:", error);
        throw new Error("Failed to fetch user.");
    }
}
export async function createEmployee(userEmail: string) {
    if (!userEmail) {
        return {
            errors: {},
            message: "Missing userId. Failed to craete employee",
        };
    }
    try {
        // const hashedPassword = await bcrypy.hash("adminpassword", 10);
        // const newUser = await prisma.user.create({
        //     data: {
        //         email: "admin@ruby.com",
        //         firstName: "admin",
        //         isVerified: true,
        //         password: hashedPassword,
        //         isVerifiedPhoneNumber: false,
        //     },
        // });
        const user = await prisma.user.findUnique({
            where: {
                email: userEmail,
            },
        });
        if (!user) {
            return {
                errors: {},
                message: "User not found",
            };
        }

        await prisma.employee.create({
            data: {
                userId: user.id,
                salary: 1000,
                role: "EMPLOYEE",
            },
        });
    } catch (error) {
        throw new Error("Error creating admin" + error);
    }
}
