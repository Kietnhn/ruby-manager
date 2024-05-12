"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { collectionSchema } from "../schema";
import { CollectionProductVariation, FullProduct, State } from "../definitions";
//colections
const CreateCollection = collectionSchema;
export async function createCollection(
    selectedProducts: FullProduct[],
    prevState: State,
    formData: FormData
) {
    const validatedFields = CreateCollection.safeParse({
        name: formData.get("name"),
        code: formData.get("code"),
        description: formData.get("description"),
        image: formData.get("image"),
    });

    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to create collection.",
        };
    }
    if (!selectedProducts || selectedProducts.length <= 1) {
        return {
            errors: {},
            message: "Need at least 2 products to create a collection.",
        };
    }
    try {
        const productIds = selectedProducts.map((p) => p.id);
        const { name, image, code, description } = validatedFields.data;
        const createdCollection = await prisma.collection.create({
            data: {
                code: code,
                name,
                image: image,
                description: description || "",
                productIds: productIds,
            },
        });
        // many to many relationships
        await prisma.product.updateMany({
            where: {
                id: {
                    in: productIds,
                },
            },
            data: {
                collectionIds: {
                    push: createdCollection.id,
                },
            },
        });
    } catch (error) {
        console.log(error);
        throw new Error("Error at creating collection" + error);
    }
    revalidatePath("/dashboard/collections/create");
    redirect("/dashboard/collections");
}
export async function getCollections() {
    try {
        const collections = await prisma.collection.findMany({
            orderBy: {
                createdAt: "desc",
            },
            where: {
                deleted: false,
            },
        });
        return collections;
    } catch (error) {
        throw new Error("Error at getting collections" + error);
    }
}
export async function deleteCollection(collectionId: string) {
    if (!collectionId) {
        throw new Error("Missing collection id in deleteCollection");
    }
    try {
        await prisma.collection.update({
            where: {
                id: collectionId,
            },
            data: {
                deleted: true,
            },
        });
        // await prisma.product.updateMany({
        //     where: {
        //         collectionId: collectionId,
        //     },
        //     data: {
        //         collectionId: null,
        //     },
        // });
    } catch (error) {
        throw new Error("Error deleting collection" + error);
    }
    redirect("/dashboard/collections");
}
export async function getCollectionById(collectionId: string) {
    if (!collectionId) {
        throw new Error("Missing collectionId to get collection");
    }
    try {
        const collection = await prisma.collection.findUnique({
            where: {
                id: collectionId,
            },
            include: {
                products: {
                    include: {
                        variations: true,
                    },
                },
            },
        });
        return collection as CollectionProductVariation;
    } catch (error) {
        throw new Error("Error getting collection by id" + error);
    }
}
