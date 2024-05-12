"use server";

import prisma from "@/lib/prisma";
import { Order, User } from "@prisma/client";
import { countOccurrences } from "../utils";
import {
    IOutOfStockProduct,
    IRecentOrder,
    ITopCustomer,
    ITopSelling,
} from "../definitions";
import { unstable_noStore as noStore } from "next/cache";
export async function getAllRevenue(): Promise<number> {
    noStore();
    try {
        const orders = await prisma.order.findMany({
            where: {
                deleted: false,
            },
        });
        let totalRevenue = orders.reduce(
            (total, order) => total + order.totalPrice,
            0
        );

        return totalRevenue;
    } catch (error) {
        console.error("Error retrieving revenue:", error);
        throw error;
    }
}
export async function getNumberOfOrders(): Promise<number> {
    noStore();
    try {
        const numberOfOrders = await prisma.order.count({
            where: {
                deleted: false,
            },
        });
        return numberOfOrders;
    } catch (error) {
        throw new Error("Error at get number of users" + error);
    }
}
export async function getNumberOfUsers(): Promise<number> {
    noStore();
    try {
        const numberOfUsers = await prisma.user.count();
        return numberOfUsers;
    } catch (error) {
        throw new Error("Error at get number of users" + error);
    }
}
export async function getRevenue(targetTime: Date): Promise<Order[]> {
    noStore();
    try {
        const revenue = await prisma.order.findMany({
            where: {
                createdAt: {
                    gt: targetTime,
                },
            },
        });
        return revenue;
    } catch (error) {
        throw new Error("Error at get revenue" + error);
    }
}
export async function getTopCustomer(): Promise<ITopCustomer[]> {
    noStore();
    try {
        const topUsers = await prisma.user.findMany({
            orderBy: {
                score: "desc",
            },
            include: {
                orders: true,
            },
            take: 7,
        });

        return topUsers;
    } catch (error) {
        throw new Error("Error at get top customer" + error);
    }
}

export async function getSoldBrand() {
    noStore();
    try {
        const soldBrand = await prisma.orderProduct.findMany({
            select: {
                variation: {
                    select: {
                        product: {
                            select: {
                                brand: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        const brandArray = soldBrand
            .map((orderProduct) => orderProduct.variation.product?.brand?.name)
            .filter((brand) => brand !== undefined);
        const result = countOccurrences(brandArray as string[]);

        return result;
    } catch (error) {
        throw new Error("Error at get top customer" + error);
    }
}

export async function getTopSelling(): Promise<ITopSelling[]> {
    noStore();
    try {
        const groupProduct = await prisma.orderProduct.groupBy({
            by: ["productId"],
            _sum: {
                quantity: true,
            },
            orderBy: {
                _sum: {
                    quantity: "desc",
                },
            },

            take: 10,
        });
        const productIds = groupProduct.map((item) => item.productId);
        const selling = await prisma.product.findMany({
            where: {
                id: {
                    in: productIds,
                },
            },

            select: {
                id: true,
                category: {
                    select: {
                        name: true,
                    },
                },
                name: true,
                gallery: true,
                sku: true,
            },
        });
        const result = selling
            .map((item) => {
                const matched = groupProduct.find(
                    (v) => v.productId === item.id
                );
                // if(!matched)
                return {
                    ...item,
                    quantity: matched?._sum.quantity || 0,
                };
            })
            .sort((a, b) => b.quantity - a.quantity);

        return result;
        // const topSellingProducts = await prisma.orderProduct.findMany({
        //     orderBy: {
        //         quantity: "desc",
        //     },

        //     select: {
        //         variation: {
        //             select: {
        //                 product: true,
        //             },
        //         },
        //     },
        // });
    } catch (error) {
        throw new Error("Error at get top customer" + error);
    }
}
export async function getTopProductOrigin() {
    noStore();
    try {
        // const topUsers = await prisma.order.findMany({
        //     orderBy: {
        //         score: "desc",
        //     },
        //     take: 5,
        // });
        // return topUsers;
    } catch (error) {
        throw new Error("Error at get top customer" + error);
    }
}
export async function getRecentOrders(): Promise<IRecentOrder[]> {
    noStore();
    try {
        const groupProduct = await prisma.orderProduct.groupBy({
            by: ["productId", "createdAt"],

            orderBy: {
                createdAt: "desc",
            },

            take: 4,
        });
        // console.table(
        //     groupProduct.map((item) => ({
        //         ...item,
        //         createdAt: item.createdAt?.toLocaleString(),
        //     }))
        // );
        const productIds = groupProduct.map((item) => item.productId);

        const recentOrders = await prisma.product.findMany({
            where: {
                id: {
                    in: productIds,
                },
            },
            select: {
                id: true,
                name: true,
                gallery: true,
                price: true,
                priceCurrency: true,
            },
        });
        const result = recentOrders
            .map((item) => {
                const matched = groupProduct.find(
                    (v) => v.productId === item.id
                );
                // if(!matched)
                return {
                    ...item,
                    createdAt: matched?.createdAt as Date,
                };
            })
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            );

        return result;
    } catch (error) {
        throw new Error("Error at get top customer" + error);
    }
}
export async function getOutOfStockProducts(): Promise<IOutOfStockProduct[]> {
    noStore();
    try {
        const outOfStockProducts = await prisma.product.findMany({
            where: {
                variations: {
                    some: {
                        stock: 0,
                    },
                },
                deleted: false,
                isAvailable: true,
            },

            select: {
                id: true,
                name: true,
                description: true,
                gallery: true,
                price: true,
                priceCurrency: true,
                _count: {
                    select: {
                        variations: {
                            where: {
                                stock: {
                                    gt: 0,
                                },
                            },
                        },
                    },
                },
            },
            take: 5,
        });
        const sortedResult = outOfStockProducts.sort(
            (a, b) => a._count.variations - b._count.variations
        );
        return sortedResult;
    } catch (error) {
        throw new Error("Error at get out of stock products" + error);
    }
}
