"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { IInternalNotification } from "../definitions";
// Notifications
export async function getInternalNotifications(): Promise<
    IInternalNotification[]
> {
    try {
        const adminEmail = process.env.EMAIL_ADMIN;
        if (!adminEmail) {
            throw new Error("Server error: admin unseted");
        }
        const internalNotifications = await prisma.notification.findMany({
            where: {
                deleted: false,
                isInternal: true,
                recipient: {
                    email: adminEmail,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                product: true,
            },
        });
        return internalNotifications;
    } catch (error) {
        throw new Error("Error at get internal notifications" + error);
    }
}
export async function setIsReadedNotification(notificationId: string) {
    try {
        await prisma.notification.update({
            where: {
                id: notificationId,
            },
            data: {
                isReaded: true,
            },
        });
    } catch (error) {
        throw new Error("Error at set is readed notifications" + error);
    }
}
export async function setReadedAllNotifications(notificationIds: string[]) {
    try {
        await prisma.notification.updateMany({
            where: {
                id: {
                    in: notificationIds,
                },
            },
            data: {
                isReaded: true,
            },
        });
    } catch (error) {
        throw new Error("Error at set is readed notifications" + error);
    }
}
export async function deleteNotifications(notificationIds: string[]) {
    if (!notificationIds || notificationIds.length === 0) {
        throw new Error("Missing notification ids ");
    }
    try {
        await prisma.notification.updateMany({
            where: {
                id: {
                    in: notificationIds,
                },
            },
            data: {
                deleted: true,
            },
        });
    } catch (error) {
        throw new Error("Error at delete notifications" + error);
    }
    revalidatePath("/");
}
