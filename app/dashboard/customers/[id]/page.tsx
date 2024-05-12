import Breadcrumbs from "@/components/breadcrumbs";
import { DataTable } from "@/components/data-table";
import NotFound from "@/components/not-found";
import { getCustomerById } from "@/lib/actions";
import { Avatar, Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import React from "react";
import { columns } from "./columns";

export default async function CustomerDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const customer = await getCustomerById(params.id);
    if (!customer)
        return <NotFound href="/dashboard/customers" title="customers" />;
    return (
        <main>
            <div className="flex mb-4">
                <Breadcrumbs
                    breadcrumbs={[
                        {
                            label: "Customers",
                            href: "/dashboard/customers",
                        },
                        {
                            label: "Customer details",
                            href: "#",
                            active: true,
                        },
                    ]}
                />
            </div>
            <div className="flex gap-4">
                <div className="w-3/4">
                    <div className="w-full mb-4">
                        <Card>
                            <CardBody className="flex gap-2 flex-row items-center">
                                <Avatar
                                    size="lg"
                                    src={customer?.avatar || ""}
                                    alt={customer.email}
                                />
                                <div className="flex flex-col">
                                    <h3 className="font-semibold ">
                                        {customer.firstName} {customer.lastName}
                                    </h3>
                                    <p className="text-gray-500">
                                        {customer.email}
                                    </p>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                    <div className="w-full mb-4">
                        <Card>
                            <CardHeader>Order placed</CardHeader>
                            <Divider />
                            <CardBody>
                                <DataTable
                                    enableFilter={true}
                                    searchId="id"
                                    data={customer.orders}
                                    setData={null}
                                    columns={columns}
                                />
                            </CardBody>
                        </Card>
                    </div>
                </div>
                <div className="w-1/4">
                    <Card></Card>
                </div>
            </div>
        </main>
    );
}
