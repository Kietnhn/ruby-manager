import React from "react";
import { DataTable } from "../data-table";
import { Property } from "@prisma/client";
import { columns } from "@/app/dashboard/products/properties/[name]/columns";

export default async function TableGroupProperties({
    properties,
}: {
    properties: Property[];
}) {
    return (
        <div>
            <DataTable columns={columns} data={properties} setData={null} />
        </div>
    );
}
