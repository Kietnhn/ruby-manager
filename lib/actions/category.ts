"use server";

import { ICategory, State } from "../definitions";
import prisma from "../prisma";
import { categoryShema, measurementShema } from "../schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { splitAndTrimString } from "../utils";
// dashboard/category
export async function updateFieldCategory() {
    try {
        await prisma.category.updateMany({
            data: {
                createdAt: new Date(),
            },
        });
    } catch (error) {
        throw new Error("Couldn't find categories" + error);
    }
}
export async function getNonMeasurementCategories() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                parent: true,
                measurement: true,
            },
            where: {
                deleted: false,
                parentId: {
                    not: null,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return categories as ICategory[];
    } catch (error) {
        throw new Error("Couldn't find categories" + error);
    }
}
export async function getCategories() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                parent: true,
                measurement: true,
            },
            where: {
                deleted: false,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return categories as ICategory[];
    } catch (error) {
        throw new Error("Couldn't find categories" + error);
    }
}
export async function getDeletedCategories() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                parent: true,
                measurement: true,
            },
            where: {
                deleted: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return categories as ICategory[];
    } catch (error) {
        throw new Error("Couldn't find categories" + error);
    }
}
const CreateCategory = categoryShema;

export async function createCategory(prevState: State, formData: FormData) {
    const validatedFields = CreateCategory.safeParse({
        name: formData.get("name"),
        code: formData.get("code"),
        measurementId: formData.get("measurementId"),
        parentId: formData.get("parentId"),
    });

    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to create Category.",
        };
    }

    try {
        const { code, measurementId, name, parentId } = validatedFields.data;
        const existedCode = await prisma.category.findUnique({
            where: {
                code: code,
            },
        });
        if (existedCode) {
            return {
                errors: {},
                message: "Code already existed, try another",
            };
        }
        // const parent
        await prisma.category.create({
            data: {
                code: code,
                parentId: parentId || null,
                name: name,
                measurementId: measurementId || null,
            },
        });
    } catch (error) {
        throw new Error("Error creating category" + error);
    }
    revalidatePath("/dashboard/categories/create");
    redirect("/dashboard/categories");
}
export async function deleteCategory(categoryId: string) {
    if (!categoryId) {
        throw new Error("Please enter a categoryId");
    }
    try {
        const categoryToDelete = await prisma.category.findUnique({
            where: { id: categoryId },
        });

        if (!categoryToDelete) {
            throw new Error("Category not Found");
        }

        // Delete the category
        await prisma.category.update({
            where: { id: categoryId },
            data: {
                deleted: true,
            },
        });
        // const parent
    } catch (error) {
        throw new Error("Error creating category" + error);
    }
    revalidatePath(`/dashboard/categories/${categoryId}/edit`);
    redirect("/dashboard/categories");
}
export async function restoreCategory(categoryId: string) {
    if (!categoryId) {
        throw new Error("Please enter a categoryId");
    }
    try {
        const categoryToDelete = await prisma.category.findUnique({
            where: { id: categoryId },
        });

        if (!categoryToDelete) {
            throw new Error("Category not Found");
        }

        // Delete the category
        await prisma.category.update({
            where: { id: categoryId },
            data: {
                deleted: false,
            },
        });
        // const parent
    } catch (error) {
        throw new Error("Error creating category" + error);
    }
    redirect("/dashboard/categories");
}
export async function deepDeleteCategory(categoryId: string) {
    try {
        await prisma.product.updateMany({
            where: {
                categoryId: categoryId,
            },
            data: {
                categoryId: null,
            },
        });
        await prisma.category.updateMany({
            where: {
                parentId: categoryId,
            },
            data: {
                parentId: null,
            },
        });
        await prisma.category.delete({
            where: {
                id: categoryId,
            },
        });
    } catch (error) {
        throw new Error("Error deep deleting category" + error);
    }
    revalidatePath(`/dashboard/categories/deleted`);
    redirect("/dashboard/categories");
}
export async function getCategoryById(categoryId: string) {
    if (!categoryId) {
        throw new Error("Missing categoryId");
    }
    try {
        const category = await prisma.category.findUnique({
            where: {
                id: categoryId,
            },
            include: {
                parent: true,
                measurement: true,
            },
        });
        return category as ICategory;
    } catch (error) {
        throw new Error("Error getting category by id" + error);
    }
}
const EditCategory = categoryShema;

export async function editCategory(
    categoryId: string,
    prevState: State,
    formData: FormData
) {
    if (!categoryId) {
        return {
            errors: {},
            message: "Missing categoryId",
        };
    }
    const validatedFields = EditCategory.safeParse({
        name: formData.get("name"),
        code: formData.get("code"),
        measurementId: formData.get("measurementId"),
        parentId: formData.get("parentId"),
    });

    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to edit category.",
        };
    }

    try {
        const { code, measurementId, name, parentId } = validatedFields.data;
        const existedCode = await prisma.category.findUnique({
            where: {
                code: code,
                NOT: {
                    id: categoryId,
                },
            },
        });
        if (existedCode) {
            return {
                errors: {},
                message: "Code already existed, try another",
            };
        }
        // const parent
        await prisma.category.update({
            data: {
                code: code,
                parentId: parentId || null,
                name: name,
                measurementId,
            },
            where: {
                id: categoryId,
            },
        });
    } catch (error) {
        throw new Error("Error creating category" + error);
    }
    revalidatePath(`/dashboard/categories/${categoryId}/edit`);
    redirect("/dashboard/categories");
}
// measurements
export async function createMeasurement(prevState: State, formData: FormData) {
    console.log({
        name: formData.get("name"),
        description: formData.get("description"),
        sizes: formData.get("sizes"),
    });

    const validatedFields = measurementShema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
        sizes: formData.get("sizes"),
    });
    console.log(validatedFields.success);

    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to create measurement.",
        };
    }

    try {
        const { name, sizes, description } = validatedFields.data;
        console.log({ name, sizes, description });
        const sizesArray = splitAndTrimString(sizes);

        await prisma.measurement.create({
            data: { name: name, description: description, sizes: sizesArray },
        });
    } catch (error) {
        throw new Error("Error creating measurement" + error);
    }
    revalidatePath("/dashboard/categories/measurements");
    redirect("/dashboard/categories/measurements");
}
export async function getMeasurements() {
    try {
        const measurements = await prisma.measurement.findMany({
            where: {
                deleted: false,
            },
        });

        return measurements;
    } catch (error) {
        throw new Error("Error getting measurement" + error);
    }
}
export async function getMeasurementById(id: string) {
    try {
        const measurement = await prisma.measurement.findUnique({
            where: {
                id: id,
            },
        });
        return measurement;
    } catch (error) {
        throw new Error("Error getting measurement by id" + error);
    }
}
export async function editMeasurement(
    measurementId: string,
    prevState: State,
    formData: FormData
) {
    if (!measurementId) {
        return {
            errors: {},
            message: "Missing measurementId",
        };
    }
    const validatedFields = measurementShema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
        sizes: formData.get("sizes"),
    });

    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to edit measurement.",
        };
    }

    try {
        const { name, sizes, description } = validatedFields.data;
        const sizesArray = splitAndTrimString(sizes);

        await prisma.measurement.update({
            data: { name: name, description: description, sizes: sizesArray },
            where: {
                id: measurementId,
            },
        });
    } catch (error) {
        throw new Error("Error at edit measurement" + error);
    }
    revalidatePath("/dashboard/categories/measurements");
    redirect("/dashboard/categories/measurements");
}
