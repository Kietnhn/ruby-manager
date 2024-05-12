"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { brandShema } from "../schema";
import { Brand, Image } from "@prisma/client";
import { State } from "../definitions";
//brand
const CreateBrand = brandShema;

export async function createBrand(
    images: Image[],
    prevState: State,
    formData: FormData
) {
    const validatedFields = CreateBrand.safeParse({
        name: formData.get("name"),
        code: formData.get("code"),
        url: formData.get("url"),
        slogan: formData.get("slogan"),
        logo: formData.get("logo"),
        description: formData.get("description"),
    });

    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to create Order.",
        };
    }
    const imageUrls = images.map((image) => image.url);
    try {
        const { logo, name, url, code, slogan, description } =
            validatedFields.data;

        await prisma.brand.create({
            data: {
                code: code || name.substring(0, 3),
                logo: logo,
                name: name,
                url: url,
                description: description,
                image: imageUrls[0],
                slogan: slogan,
            },
        });
    } catch (error) {
        throw new Error("Error at creating brand" + error);
    }
    revalidatePath("/dashboard/brands/create");
    redirect("/dashboard/brands");
}
export async function getBrands(): Promise<Brand[]> {
    try {
        const brands = await prisma.brand.findMany({
            orderBy: {
                createdAt: "desc",
            },
            where: {
                deleted: false,
            },
        });
        return brands;
    } catch (error) {
        throw new Error("Error at getting brands" + error);
    }
}
