"use client";
import React, { Suspense, use } from "react";
import { DataTable } from "../data-table";
import { columns } from "@/app/dashboard/orders/columns";
import { getOrders } from "@/lib/actions/order";

export default function TableOrders() {
    const orders = use(getOrders());

    return (
        <Suspense fallback={<div>Loading orders...</div>}>
            <DataTable columns={columns} data={orders} setData={null} />
        </Suspense>
    );
}
