"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
    ISectionCarouselData,
    ISectionLandscapeData,
    State,
} from "../definitions";
import { SectionCarouselSchema, SectionLandscapeSchema } from "../schema";

const CreateCarouselSectionSchema = SectionCarouselSchema;
export async function createCarouselSection(
    sectionData: ISectionCarouselData,
    prevState: State
) {
    try {
        const validatedFields =
            CreateCarouselSectionSchema.safeParse(sectionData);
        console.table(sectionData.sources);
        if (!validatedFields.success) {
            console.log(validatedFields.error.formErrors.fieldErrors);
            console.log(validatedFields.error.format());
            // console.log(validatedFields.error.format()?.sources.0);

            return {
                errors: validatedFields.error.format(),
                message: "Missing Fields. Failed to create section.",
            };
        }
        const { handle, sources, title, description } = validatedFields.data;
        await prisma.section.create({
            data: {
                handle,
                type: "CAROUSEL",
                description,
                sources,
                title,
            },
        });
    } catch (error) {
        throw new Error("Error creating section" + error);
    }
    revalidatePath("/dashboard/sections/create/carousel");
    redirect("/dashboard/sections");
}
const CreateLandscapeSectionSchema = SectionLandscapeSchema;
export async function createLandscapeSection(
    sectionData: ISectionLandscapeData,
    prevState: State
) {
    try {
        const validatedFields =
            CreateLandscapeSectionSchema.safeParse(sectionData);
        if (!validatedFields.success) {
            console.log(validatedFields.error.formErrors.fieldErrors);
            console.log(validatedFields.error.format());
            return {
                errors: validatedFields.error.format(),
                message: "Missing Fields. Failed to create section.",
            };
        }
        const { handle, source, title, description, subTitle } =
            validatedFields.data;
        await prisma.section.create({
            data: {
                handle,
                type: "LANDSCAPE",
                description,
                sources: [source],
                title,
                subTitle,
            },
        });
    } catch (error) {
        throw new Error("Error creating section" + error);
    }
    revalidatePath("/dashboard/sections/create/landscape");
    redirect("/dashboard/sections");
}
