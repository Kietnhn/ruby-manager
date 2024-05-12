"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PageContainParent, State } from "../definitions";
import { pageSchema } from "../schema";
// page
export async function getPages() {
    try {
        const pages = await prisma.page.findMany({
            where: {
                deleted: false,
            },
            include: {
                parent: true,
            },
        });
        return pages as PageContainParent[];
    } catch (error) {
        throw new Error("Error at get pages" + error);
    }
}

export async function getPageById(pageId: string) {
    try {
        const pages = await prisma.page.findUnique({
            include: {
                parent: true,
            },
            where: {
                id: pageId,
            },
        });
        return pages as PageContainParent;
    } catch (error) {
        throw new Error("Error at get pages" + error);
    }
}
const CreatePage = pageSchema;
export async function createPage(prevState: State, formData: FormData) {
    console.log({
        title: formData.get("title"),
        body: formData.get("body"),
        description: formData.get("description"),
        handle: formData.get("handle"),
        visibility: formData.get("visibility"),
        public: formData.get("public"),
        parentId: formData.get("parentId"),
    });

    const validatedFields = CreatePage.safeParse({
        title: formData.get("title"),
        body: formData.get("body"),
        description: formData.get("description"),
        handle: formData.get("handle"),
        visibility: formData.get("visibility"),
        public: formData.get("public"),
        parentId: formData.get("parentId"),
    });

    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to create Page.",
        };
    }
    try {
        const { description, body, handle, title, visibility, parentId } =
            validatedFields.data;
        const publicDate = validatedFields.data.public;
        await prisma.page.create({
            data: {
                title,
                body,
                handle,
                url: "/" + handle,
                description,
                parentId: parentId || null,
                public: publicDate,
                visibility: visibility,
            },
        });
    } catch (error) {
        throw new Error("Error at create page" + error);
    }
    revalidatePath("/dashboard/pages/create");
    redirect("/dashboard/pages");
}
export async function editPage(
    pageId: string,
    prevState: State,
    formData: FormData
) {
    if (!pageId) {
        return {
            errors: {},
            message: "Missing pageId. Failed to edit Page.",
        };
    }
    const validatedFields = CreatePage.safeParse({
        title: formData.get("title"),
        body: formData.get("body"),
        description: formData.get("description"),
        handle: formData.get("handle"),
        visibility: formData.get("visibility"),
        public: formData.get("public"),
        parentId: formData.get("parentId"),
    });

    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to create Page.",
        };
    }
    try {
        const { description, body, handle, title, visibility, parentId } =
            validatedFields.data;
        const publicDate = validatedFields.data.public;
        await prisma.page.update({
            data: {
                title,
                body,
                handle,
                url: "/" + handle,
                description,
                parentId: parentId || null,
                public: publicDate,
                visibility: visibility,
            },
            where: {
                id: pageId,
            },
        });
    } catch (error) {
        throw new Error("Error at edit page" + error);
    }
    revalidatePath("/dashboard/pages/create");
    redirect("/dashboard/pages");
}
export async function deletePage(pageId: string) {
    if (!pageId) {
        throw new Error("Missing page id in delete page");
    }
    try {
        await prisma.page.update({
            where: {
                id: pageId,
            },
            data: {
                deleted: true,
            },
        });
    } catch (error) {
        throw new Error("Error at delete page" + error);
    }
    revalidatePath("/dashboard/pages");
    redirect("/dashboard/pages");
}
