"use server";

import { State } from "../definitions";
import { discountShema } from "../schema";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Discount } from "@prisma/client";

const CreateDiscount = discountShema;
export async function createDiscount(prevState: State, formData: FormData) {
    console.log({
        startDate: formData.get("startDate"),
        endDate: formData.get("endDate"),
    });

    const validatedFields = CreateDiscount.safeParse({
        name: formData.get("name"),
        code: formData.get("code"),
        description: formData.get("description"),
        value: formData.get("value"),
        minTotalPrice: formData.get("minTotalPrice"),
        discountType: formData.get("discountType"),
        startDate: formData.get("startDate"),
        endDate: formData.get("endDate"),
        isPublic: formData.get("isPublic"),
        quantity: formData.get("quantity"),
    });
    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);

        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to create discount.",
        };
    }

    try {
        const {
            code,
            discountType,
            endDate,
            isPublic,
            name,
            startDate,
            value,
            description,
            minTotalPrice,
            quantity,
        } = validatedFields.data;
        const existedCodeDiscount = await prisma.discount.findUnique({
            where: {
                code: code,
            },
        });
        if (existedCodeDiscount) {
            return {
                errors: {
                    code: ["Code already existed, Please change another code"],
                },
                message: "Invalid Fields. Failed to create discount.",
            };
        }
        await prisma.discount.create({
            data: {
                code,
                description,
                name,
                quantity,
                type: discountType,
                value,
                valueCurrency: "USD",
                start_date: startDate,
                end_date: endDate,
                isPublic: isPublic,
                minTotalPrice: minTotalPrice,
            },
        });
    } catch (error) {
        throw new Error("Error at creating discount " + error);
    }
    revalidatePath("/dashboard/discounts/create");
    redirect("/dashboard/discounts");
}
export async function getDiscounts(): Promise<Discount[]> {
    try {
        const discounts = await prisma.discount.findMany({
            where: {
                deleted: false,
            },
        });
        return discounts;
    } catch (error) {
        throw new Error("Error at getting discounts " + error);
    }
}
export async function getProductDiscounts(): Promise<Discount[]> {
    try {
        const discounts = await prisma.discount.findMany({
            where: {
                AND: [
                    {
                        deleted: false,
                    },
                    {
                        type: {
                            not: "SHIPPING",
                        },
                    },
                ],
            },
        });
        return discounts;
    } catch (error) {
        throw new Error("Error at getting discounts " + error);
    }
}
export async function getDiscountsById(id: string): Promise<Discount | null> {
    if (!id) throw new Error("Missing discount id, Failed to get discount");
    try {
        const discount = await prisma.discount.findUnique({
            where: {
                id: id,
            },
        });
        return discount;
    } catch (error) {
        throw new Error("Error at get discount by id" + error);
    }
}
export async function editDiscount(
    discountId: string,
    prevState: State,
    formData: FormData
) {
    if (!discountId)
        throw new Error("Missing discount id, Failed to edit discount");

    const validatedFields = CreateDiscount.safeParse({
        name: formData.get("name"),
        code: formData.get("code"),
        description: formData.get("description"),
        value: formData.get("value"),
        minTotalPrice: formData.get("minTotalPrice"),
        discountType: formData.get("discountType"),
        startDate: formData.get("startDate"),
        endDate: formData.get("endDate"),
        isPublic: formData.get("isPublic"),
        quantity: formData.get("quantity"),
    });
    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);

        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to create discount.",
        };
    }

    try {
        const {
            code,
            discountType,
            endDate,
            isPublic,
            name,
            startDate,
            value,
            description,
            minTotalPrice,
            quantity,
        } = validatedFields.data;
        const existedCodeDiscount = await prisma.discount.findFirst({
            where: {
                AND: [
                    {
                        code: code,
                    },
                    {
                        id: {
                            not: discountId,
                        },
                    },
                ],
            },
        });
        if (existedCodeDiscount) {
            return {
                errors: {
                    code: ["Code already existed, Please change another code"],
                },
                message: "Invalid Fields. Failed to create discount.",
            };
        }
        await prisma.discount.update({
            where: {
                id: discountId,
            },
            data: {
                code,
                description,
                name,
                quantity,
                type: discountType,
                value,
                valueCurrency: "USD",
                start_date: startDate,
                end_date: endDate,
                isPublic: isPublic,
                minTotalPrice: minTotalPrice,
            },
        });
    } catch (error) {
        throw new Error("Error at creating discount " + error);
    }
    revalidatePath(`/dashboard/discounts/create/${discountId}/edit`);
    redirect("/dashboard/discounts");
}
