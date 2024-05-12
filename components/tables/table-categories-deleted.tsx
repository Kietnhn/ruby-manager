import { getDeletedCategories } from "@/lib/actions/category";
import React from "react";
import { DataTable } from "../data-table";
import { columns } from "@/app/dashboard/categories/deleted/columns";
import Test from "../Test";

export default async function TableDeletedCategories() {
    const deletedCategories = await getDeletedCategories();
    if (!deletedCategories) {
        return <p>Somethings wrong at get deletedCategories</p>;
    }

    return (
        <div>
            {/* <Test data={deletedCategories} /> */}
            <DataTable
                columns={columns}
                data={deletedCategories}
                setData={null}
            />
        </div>
    );
}
