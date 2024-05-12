"use server";
"use server";
import prisma from "@/lib/prisma";
import { v4 as uuid } from "uuid";
import { getEmployee } from "../actions/user";
import { State } from "../definitions";
import { newPasswordSchema } from "../schema";
import bcrypt from "bcrypt";

export async function newPassword(
    token: string,
    prevState: State,
    formData: FormData
) {
    if (!token) {
        return {
            errors: {},
            message: "Missing token. Failed to create new password.",
            success: false,
        };
    }
    const validatedFields = newPasswordSchema.safeParse({
        password: formData.get("password"),
    });
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to create new password.",
            success: false,
        };
    }
    const { password } = validatedFields.data;
    try {
        const existedToken = await getResetPasswordTokenByToken(token);
        console.log(existedToken);

        if (!existedToken) {
            return {
                errors: {},
                message: "Token does not exist",
                success: false,
            };
        }

        const isExpired = new Date(existedToken.expires) < new Date();
        if (isExpired) {
            return {
                errors: {},
                message: "Token has expired",
                success: false,
            };
        }
        const existedEmployee = await getEmployee(existedToken.email);
        if (!existedEmployee) {
            return {
                errors: {},
                message: "Email does not exist",
                success: false,
            };
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
            where: {
                id: existedEmployee.id,
            },
            data: {
                password: hashedPassword,
            },
        });
        await prisma.resetPasswordToken.delete({
            where: {
                id: existedToken.id,
            },
        });
        return {
            errors: {},
            message: "Password has been updated",
            success: true,
        };
    } catch (error) {
        return {
            errors: {},
            message: "Internal server error",
            success: false,
        };
    }
}
export async function generateResetPasswordToken(email: string) {
    const token = uuid();
    const expires = new Date(new Date().getTime() + 3600 * 1000);
    const existedToken = await getResetPasswordTokenByEmail(email);
    if (existedToken) {
        await prisma.resetPasswordToken.delete({
            where: { id: existedToken.id },
        });
    }
    const resetPasswordToken = await prisma.resetPasswordToken.create({
        data: {
            email,
            token,
            expires,
        },
    });
    return resetPasswordToken;
}

export async function getResetPasswordTokenByEmail(email: string) {
    try {
        const token = await prisma.resetPasswordToken.findFirst({
            where: { email },
        });
        return token;
    } catch (error) {
        return null;
    }
}
export async function getResetPasswordTokenByToken(token: string) {
    try {
        const resetPasswordToken = await prisma.resetPasswordToken.findFirst({
            where: {
                token: token,
            },
        });
        return resetPasswordToken;
    } catch (error) {
        return null;
    }
}
