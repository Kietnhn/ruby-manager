import { getOrderById } from "@/lib/actions/order";
import React from "react";
import NotFound from "@/components/not-found";
import Breadcrumbs from "@/components/breadcrumbs";
import { DataTable } from "@/components/data-table";
import { columns } from "@/app/dashboard/orders/[id]/columns";
import { Avatar, Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

export default async function OrderDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const orderDetail = await getOrderById(params.id);
    if (!orderDetail) {
        return <NotFound href="/dashboard/orders" title="orders" />;
    }
    return (
        <main>
            <div className="mb-4">
                <Breadcrumbs
                    breadcrumbs={[
                        {
                            href: "/dashboard/orders",
                            label: "Orders",
                        },
                        {
                            label: "Order Details",
                            href: "#",
                            active: true,
                        },
                    ]}
                />
            </div>
            <div className="flex gap-4">
                <Card className="w-2/3">
                    <CardHeader className="font-semibold text-xl">
                        Order details
                    </CardHeader>
                    <Divider />

                    <CardBody>
                        <div className="mb-4">
                            <DataTable
                                data={orderDetail.orderProducts}
                                columns={columns}
                                setData={null}
                            />
                        </div>
                        <div className="flex justify-end items-center ">
                            <div className=" w-1/3">
                                <div className="w-full flex mb-1">
                                    <div className="w-1/2">
                                        <small className="leading-4 text-gray-500">
                                            SubTotal:
                                        </small>
                                    </div>
                                    <div className="w-1/2">
                                        <strong>
                                            ${orderDetail.totalPrice}
                                        </strong>
                                    </div>
                                </div>
                                <div className="w-full flex mb-1">
                                    <div className="w-1/2">
                                        <small className="leading-4 text-gray-500">
                                            Estimated Delivery & Handling:
                                        </small>
                                    </div>
                                    <div className="w-1/2 flex items-end">
                                        <strong>$0</strong>
                                    </div>
                                </div>
                                <div className="w-full flex mb-1">
                                    <div className="w-1/2">
                                        <small className="leading-4 text-gray-500">
                                            Total:
                                        </small>
                                    </div>
                                    <div className="w-1/2">
                                        <strong>
                                            ${orderDetail.totalPrice}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <div className="w-1/3">
                    <Card className="">
                        <CardHeader className="font-semibold text-xl">
                            Customer
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            <Link
                                href={`/dashboard/customers/${orderDetail.userId}`}
                                className="group"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-2 items-center">
                                        <Avatar
                                            src={
                                                orderDetail.user.image as string
                                            }
                                            alt={
                                                orderDetail.user.email as string
                                            }
                                        />
                                        <p className="group-hover:text-primary group-hover:underline">
                                            {orderDetail.user.firstName}{" "}
                                            {orderDetail.user.lastName}
                                        </p>
                                    </div>
                                    <ChevronRightIcon className="w-5 h-5" />
                                </div>
                            </Link>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </main>
    );
}
