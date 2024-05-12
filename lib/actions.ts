"use server";
import prisma from "./prisma";
import cloudinary from "@/app/cloudinary";
import { UploadApiResponse } from "cloudinary";
import { CldUploadWidgetInfo, CldUploadWidgetResults } from "next-cloudinary";
import { Country } from "./definitions";

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
export async function uploadImage(formData: FormData) {
    const file = formData.get("gallary") as File;

    if (!file) {
        return {
            message: "Please enter a file",
            result: null,
        };
    }
    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
        const result: UploadApiResponse = await new Promise(
            (resolve, reject) => {
                cloudinary.uploader
                    .upload_stream({ folder: "ruby" }, function (err, stream) {
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
        return { result, message: "Uploaded image" };
    } catch (error) {
        return { message: "Failed to upload image" + error, result: null };
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
        return { countries, message: "Countries retrieved" };
    } catch (error) {
        return {
            countries: null,
            message: "Something wrong in get countries" + error,
        };
    }
}
