"use server";
import prisma from "@/lib/prisma";
import { State } from "../definitions";
import { reviewSchema } from "../schema";
import { uploadMultipleImages } from "../actions";
import { protectedAction } from "./user";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { IReviewWithUser, ISummarisePoint } from "../definitions/review";
import { Review } from "@prisma/client";

const CreateReview = reviewSchema;
export async function createReview(
    productId: string,
    state: State,
    formData: FormData
) {
    console.log({ images: formData.getAll("images") });

    const user = await protectedAction();
    if (!productId) {
        throw new Error("Missing product id to create review");
    }
    const validatedFields = CreateReview.safeParse({
        rating: formData.get("rating"),
        heading: formData.get("heading"),
        content: formData.get("content"),
        isRecommend: formData.get("isRecommend"),
        images: formData.getAll("images"),
    });

    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to create review.",
        };
    }
    try {
        const { heading, isRecommend, rating, content, images } =
            validatedFields.data;
        let uploadUrls: string[] = [];
        if (images && images.length > 0) {
            const cleanerImages: File[] = images.filter(
                (image: File) => image.size > 0
            );
            console.log("uploadUrls", images);
            console.log("cleanerImages", cleanerImages);
            if (cleanerImages.length > 0) {
                const uploadedImages = await uploadMultipleImages(
                    cleanerImages,
                    "reviews"
                );
                uploadUrls = uploadedImages.map(
                    (uploadedImage) => uploadedImage.url
                );
            }
        }
        await prisma.review.create({
            data: {
                content: content || "",
                productId: productId,
                userId: user.id,
                heading: heading,
                point: rating,
                images: uploadUrls,
                isRecommend: isRecommend,
            },
        });
    } catch (error) {
        throw new Error("Error creating review" + error);
    }

    revalidatePath(`/dashboard/products/${productId}}`);
    redirect(`/dashboard/products/${productId}`);
}
export async function getSummarizePoint(
    productId: string
): Promise<ISummarisePoint> {
    if (!productId) {
        throw new Error("Missing product id to create review");
    }
    try {
        const result = await prisma.review.aggregate({
            _avg: {
                point: true,
            },
            _count: {
                point: true,
            },

            where: {
                productId: productId,
            },
        });

        return {
            average: result._avg.point,
            count: result._count.point,
        };
    } catch (error) {
        throw new Error("Error at getting average point" + error);
    }
}
export async function get3LeastestReviewsOfProduct(
    productId: string
): Promise<IReviewWithUser[]> {
    if (!productId) {
        throw new Error("Missing product id to create review");
    }
    try {
        const reviews = await prisma.review.findMany({
            where: {
                productId: productId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        firstName: true,
                        lastName: true,
                        image: true,
                    },
                },
            },
            take: 3,
            orderBy: {
                createdAt: "desc",
            },
        });
        return reviews;
    } catch (error) {
        throw new Error("Error getting reviews" + error);
    }
}
export async function getReviewsOfProduct(
    productId: string
): Promise<IReviewWithUser[]> {
    if (!productId) {
        throw new Error("Missing product id to create review");
    }
    try {
        const reviews = await prisma.review.findMany({
            where: {
                productId: productId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        firstName: true,
                        lastName: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return reviews;
    } catch (error) {
        throw new Error("Error getting reviews" + error);
    }
}
