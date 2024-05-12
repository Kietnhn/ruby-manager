import React from "react";
import { DataTable } from "../data-table";
import { columns } from "@/app/dashboard/orders/columns";
import { getOrders } from "@/lib/actions/order";

export default async function TableOrders() {
    const orders = await getOrders();

    if (!orders) {
        return <p>Somethings wrong at get customers</p>;
    }

    return (
        <div>
            <DataTable
                columns={columns}
                data={orders}
                setData={null}
                // enableFilter={true}
            />
        </div>
    );
}
