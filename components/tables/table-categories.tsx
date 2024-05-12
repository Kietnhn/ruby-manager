import { getCategories } from "@/lib/actions/category";
import React from "react";
import { DataTable } from "../data-table";
import { columns } from "@/app/dashboard/categories/columns";

export default async function TableCategories() {
    const categories = await getCategories();
    if (!categories) {
        return <p>Somethings wrong at get categories</p>;
    }

    return (
        <div>
            {/* <Test data={categories} /> */}
            <DataTable columns={columns} data={categories} setData={null} />
        </div>
    );
}
