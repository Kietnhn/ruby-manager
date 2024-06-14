"use server";
import prisma from "./prisma";
import cloudinary from "@/app/cloudinary";
import { UploadApiResponse } from "cloudinary";
import { CldUploadWidgetInfo, CldUploadWidgetResults } from "next-cloudinary";
import { Country, State } from "./definitions";
import { Image } from "@prisma/client";

// images
export async function saveImage(result: CldUploadWidgetResults) {
    try {
        if (!result.info) {
            throw new Error("No information available");
        }
        const { public_id, url } = result.info as CldUploadWidgetInfo;
        const newImage = await prisma.image.create({
            data: { public_id: public_id, url: url },
        });
        return newImage;
    } catch (error) {
        throw new Error("Error at saving image: " + error);
    }
}
export async function uploadImage(
    folder: string = "ruby/review",
    state: State,
    formData: FormData
) {
    const file = formData.get("gallary") as File;

    if (!file) {
        throw new Error("Error at upload image: ");
    }
    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
        const result: UploadApiResponse = await new Promise(
            (resolve, reject) => {
                cloudinary.uploader
                    .upload_stream({ folder: folder }, function (err, stream) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(stream as UploadApiResponse);
                    })
                    .end(buffer);
            }
        );
        await prisma.image.create({
            data: { public_id: result.public_id, url: result.url },
        });
    } catch (error) {
        throw new Error("Error at upload image: " + error);
    }
}

export async function uploadSingleImage(
    file: File,
    folder: string = "ruby/review"
): Promise<Image> {
    if (!file) {
        throw new Error("Error at upload image: No file provided");
    }

    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
        const result: UploadApiResponse = await new Promise(
            (resolve, reject) => {
                cloudinary.uploader
                    .upload_stream({ folder: folder }, function (err, stream) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(stream as UploadApiResponse);
                    })
                    .end(buffer);
            }
        );
        const image = await prisma.image.create({
            data: { public_id: result.public_id, url: result.url },
        });
        return image;
    } catch (error) {
        throw new Error("Error at upload image: " + error);
    }
}
export async function uploadMultipleImages(
    files: File[],
    folder: string = "ruby/review"
): Promise<Image[]> {
    if (!files.length) {
        throw new Error("Error at upload multiple images: No files provided");
    }

    const uploadPromises = files.map((file) => uploadSingleImage(file, folder));

    try {
        const response = await Promise.all(uploadPromises);
        return response;
    } catch (error) {
        throw new Error("Error at upload multiple images: " + error);
    }
}

export async function getImages(offset = 0, limit = 50) {
    try {
        const last50Images = await prisma.image.findMany({
            where: {
                deleted: false,
            },
            skip: offset,
            take: limit, // Limit the number of results to 20
            orderBy: { createdAt: "desc" }, // Order by createdAt field in descending order
        });
        return last50Images;
    } catch (error) {
        throw new Error("Error at get iamges: " + error);
    }
}
export async function updateFieldImages() {
    try {
        await prisma.image.updateMany({
            data: {
                deleted: false,
            },
        });
    } catch (error) {
        throw new Error("Error at update iamges: " + error);
    }
}

// outside api
export async function getCountries() {
    try {
        const countries: Country[] = await fetch(
            "https://restcountries.com/v3.1/all?fields=name,flag,flags",
            { method: "get" }
        ).then((response) => response.json());
        return countries;
    } catch (error) {
        throw new Error("Error at getCountries: " + error);
    }
}
