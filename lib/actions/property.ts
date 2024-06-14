"use server";
import prisma from "@/lib/prisma";
import { State } from "../definitions";
import { propertyShema } from "../schema";
import { splitAndTrimString } from "../utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const CreateProperty = propertyShema;
export async function createProperty(prevState: State, formData: FormData) {
    const validatedFields = CreateProperty.safeParse({
        name: formData.get("name"),
        values: formData.get("values"),
    });

    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);

        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to create property.",
        };
    }

    // Prepare data for insertion into the database
    const { name, values } = validatedFields.data;
    const arrayValues = splitAndTrimString(values);

    try {
        const existed = await prisma.property.findMany({
            where: {
                AND: [
                    {
                        name: name,
                    },
                    {
                        value: { in: arrayValues },
                    },
                ],
            },
        });

        if (existed.length > 0) {
            const valuesExisted = existed.map((v) => v.value);
            return {
                errors: {},
                message: `Values ${valuesExisted.join(
                    ", "
                )} is already existed in property ${name}, Please remove those in form data`,
            };
        }
        for (const value of arrayValues) {
            await prisma.property.createMany({
                data: {
                    name,
                    value: value,
                },
            });
        }
    } catch (error) {
        throw new Error("Error at create property" + error);
    }
    revalidatePath("/dashboard/products/properties/create");
    redirect("/dashboard/products/properties");
}
const EditProperty = propertyShema;
export async function editProperty(
    propertyId: string,
    prevState: State,
    formData: FormData
) {
    if (!propertyId) {
        return {
            errors: {},
            message: "Missing property id Field.",
        };
    }
    const validatedFields = EditProperty.safeParse({
        name: formData.get("name"),
        values: formData.get("values"), // this is only one string value
    });

    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);

        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to create property.",
        };
    }

    // Prepare data for insertion into the database
    const { name, values } = validatedFields.data;
    if (values.includes("|")) {
        return {
            errors: {},
            message: "Just edit one value at the same time",
        };
    }
    try {
        const existedProperty = await prisma.property.findFirst({
            where: {
                name: name,
                id: {
                    not: propertyId,
                },
            },
        });
        if (existedProperty) {
            return {
                errors: {},
                message: `${existedProperty.value} already existed in property ${existedProperty.name}. Please change another name or value`,
            };
        }

        await prisma.property.update({
            where: {
                id: propertyId,
            },
            data: {
                name,
                value: values,
            },
        });
    } catch (error) {
        throw new Error("Error at create property" + error);
    }
    redirect("/dashboard/products/properties");
}
export async function getProperties() {
    // Prepare data for insertion into the database

    try {
        const properties = await prisma.property.findMany({
            where: {
                deleted: false,
            },
        });

        return properties;
    } catch (error) {
        throw new Error("Error at create property" + error);
    }
}
export async function getPropertyById(propertyId: string) {
    // Prepare data for insertion into the database
    if (!propertyId) {
        throw new Error("Error at property id at get property");
    }
    try {
        const property = await prisma.property.findUnique({
            where: {
                id: propertyId,
            },
        });
        return property;
    } catch (error) {
        throw new Error("Error at create property" + error);
    }
}
export async function getPropertiesByName(propertyName: string) {
    // Prepare data for insertion into the database
    if (!propertyName) {
        throw new Error("Missing property name at get property");
    }
    try {
        const properties = await prisma.property.findMany({
            where: {
                name: propertyName,
            },
        });
        return properties;
    } catch (error) {
        throw new Error("Error at create property" + error);
    }
}
export async function deleteProperty(propertyId: string) {
    if (!propertyId) {
        throw new Error("Missing property id in delete property");
    }
    try {
        await prisma.product.update({
            where: {
                id: propertyId,
            },
            data: {
                deleted: true,
            },
        });
    } catch (error) {
        throw new Error("Error at delete product" + error);
    }
    redirect("/dashboard/products/properties");
}
