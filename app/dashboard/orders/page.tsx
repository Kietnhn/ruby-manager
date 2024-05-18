import Wrapper from "@/components/wrapper";
import { getOrders } from "@/lib/actions/order";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import { columns } from "@/app/dashboard/orders/columns";
import { DataTable } from "@/components/data-table";

export default async function OrderPage() {
    const orders = await getOrders();
    return (
        <Wrapper
            breadcrumbs={[
                {
                    label: "Orders",
                    href: "/dashboard/orders",
                },
            ]}
            navigateButton={
                <Link href="/dashboard/orders/create">
                    <Button color="primary">
                        <PlusIcon className="w-5 h-5" />
                        New
                    </Button>
                </Link>
            }
        >
            <DataTable columns={columns} data={orders} setData={null} />
        </Wrapper>
    );
}
