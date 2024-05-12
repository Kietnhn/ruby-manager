"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { orderSchema } from "../schema";
import {
    FullOrderProduct,
    OrderEmployeeCustomer,
    OrderOrderProductVariation,
    State,
} from "../definitions";
import { mergeOrderProducts } from "../utils";
import { getEmployee, getUserAdmin, getUserById } from "./user";
// orders
const CreateOrder = orderSchema;
export async function createOrder(
    orderProducts: FullOrderProduct[],
    prevState: State,
    formData: FormData
) {
    if (orderProducts.length <= 0) {
        return {
            errors: {},
            message: "Missing order products",
        };
    }
    // extra check to make sure order products have quantity
    const isInvalidOrderProducts = orderProducts.find(
        (orderProduct) =>
            orderProduct.quantity <= 0 || orderProduct.variation === null
    );
    if (isInvalidOrderProducts) {
        return {
            errors: {},
            message: "Each order product must have a size and quantity > 0",
        };
    }

    const mergedOrderProducts = mergeOrderProducts(orderProducts);

    const isOutOfStock = mergedOrderProducts.find(
        (orderProduct) =>
            orderProduct.quantity > (orderProduct?.variation?.stock as number)
    );
    if (isOutOfStock) {
        return {
            errors: {},
            message: "Product ordered out of stock",
        };
    }
    const validatedFields = CreateOrder.safeParse({
        employee: formData.get("employee"),
        customer: formData.get("customer"),
        paymentMethod: formData.get("paymentMethod"),
    });

    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);

        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to create Order.",
        };
    }
    try {
        const { customer, employee, paymentMethod } = validatedFields.data;
        const totalPrice = mergedOrderProducts.reduce(
            (sum, current) => sum + current.subTotal,
            0
        );

        const newOrderProducts = mergedOrderProducts.map((orderProduct) => ({
            price: orderProduct.price,
            quantity: orderProduct.quantity,
            subTotal: orderProduct.subTotal,
            priceCurrency: orderProduct.priceCurrency,
            variationId: orderProduct?.variation?.id as string,
            productId: orderProduct.product.id,
        }));
        const totalQuantity = newOrderProducts.length;
        const userEmployee = await getEmployee(employee);
        if (!userEmployee || !userEmployee.employee) {
            return {
                errors: {},
                message: "Employee not found, Failed to create Order",
            };
        }
        const adminEmail = process.env.EMAIL_ADMIN;
        if (!adminEmail) {
            throw new Error("Server error: admin unseted");
        }
        const admin = await getUserAdmin(adminEmail);
        if (!admin) {
            throw new Error("Server error: admin not founded");
        }
        await prisma.$transaction(async (tx) => {
            // create order
            const ordered = await tx.order.create({
                data: {
                    orderProducts: {
                        createMany: {
                            data: newOrderProducts,
                        },
                    },
                    locatedOrder: "rubyStoreAdmin.com",
                    paymentMethod: paymentMethod,
                    priceCurrency: "USD",
                    subToTal: totalPrice,
                    status: "COMPLETED",
                    paymentStatus: "PAID",
                    quantity: totalQuantity,
                    totalPrice: totalPrice,
                    userId: customer,
                    employeeId: userEmployee?.employee?.id,
                    processedAt: new Date(),
                    paidAt: new Date(),
                    completedAt: new Date(),
                },
                include: {
                    orderProducts: {
                        include: {
                            variation: true,
                        },
                    },
                },
            });
            console.log("created order");

            // update stock
            console.log("update stock");

            for (const orderProduct of ordered.orderProducts) {
                const variationId = orderProduct.variationId;
                const quantity = orderProduct.quantity;

                // Fetch variation
                const variation = await tx.variation.findUnique({
                    where: {
                        id: variationId,
                    },
                });

                // Update stock
                if (!variation) {
                    throw new Error(
                        `Variation with ID ${variationId} not found`
                    );
                }

                if (variation.stock < quantity) {
                    throw new Error(
                        `Insufficient stock for variation ${variationId}`
                    );
                }
                console.log("updating variation");

                const updatedVariation = await tx.variation.update({
                    where: {
                        id: variationId,
                    },
                    data: {
                        stock: {
                            decrement: quantity,
                        },
                    },
                    select: {
                        productId: true,
                        stock: true,
                        product: true,
                    },
                });
                // notification
                console.log("is out of stock", updatedVariation.stock === 0);

                if (updatedVariation.stock === 0) {
                    const content = `Product ${updatedVariation.product.name} was out of stock`;

                    console.log("create notification");

                    await tx.notification.create({
                        data: {
                            content,
                            productId: updatedVariation.productId,
                            senderId: admin.id,
                            recipientId: admin.id,
                            isInternal: true,
                        },
                    });
                }
            }
            // notifications of order
            // const userCustomer = await getUserById(customer)

            // const userCustomerName = userCustomer?.name || userCustomer?.firstName || "A user"
            const contentOfNewOrder = `A user just placed an order`;
            await tx.notification.create({
                data: {
                    content: contentOfNewOrder,
                    isInternal: true,
                    recipientId: admin.id,
                    senderId: admin.id,
                },
            });

            // update score of user
            const updatedScoreUser = await tx.user.update({
                where: {
                    id: customer,
                },
                data: {
                    score: {
                        increment: ordered.totalPrice,
                    },
                },
            });

            const contentOfCustomer = `You just placed an order and accumulated ${updatedScoreUser.score} additional points`;
            await tx.notification.create({
                data: {
                    content: contentOfCustomer,
                    isInternal: false,
                    recipientId: customer,
                    senderId: admin.id,
                },
            });
            console.log("updatedScoreUser");
            if (updatedScoreUser.score >= 5000) {
                console.log("update kind of user");

                // update kind of user
                await tx.user.update({
                    where: {
                        id: updatedScoreUser.id,
                    },
                    data: {
                        kind: "VIP",
                    },
                });
            }
        });
    } catch (error) {
        throw new Error("Error at create order" + error);
    }
    revalidatePath("/dashboard/orders/create");
    redirect("/dashboard/orders");
}
export async function getOrders() {
    try {
        const orders = await prisma.order.findMany({
            where: {
                deleted: false,
            },
            include: {
                user: true,
                employee: {
                    include: {
                        user: true,
                    },
                },
            },
            take: 50,
            orderBy: {
                createdAt: "desc",
            },
        });

        return orders as OrderEmployeeCustomer[];
    } catch (error) {
        throw new Error("Error at get orders" + error);
    }
}
export async function getOrderById(orderId: string) {
    try {
        const orders = await prisma.order.findUnique({
            include: {
                orderProducts: {
                    include: {
                        variation: {
                            include: {
                                product: true,
                            },
                        },
                    },
                },

                user: true,
                employee: {
                    include: {
                        user: true,
                    },
                },
            },
            where: {
                id: orderId,
            },
        });

        return orders as OrderOrderProductVariation;
    } catch (error) {
        throw new Error("Error at get orders" + error);
    }
}
