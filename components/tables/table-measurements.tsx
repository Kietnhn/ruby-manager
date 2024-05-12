import { getCategories, getMeasurements } from "@/lib/actions/category";
import React from "react";
import { DataTable } from "../data-table";
import Test from "../Test";
import { columns } from "@/app/dashboard/categories/measurements/columns";

export default async function TableMeasurements() {
    const response = await getMeasurements();
    if (!response.measurements) {
        return <p>Somethings wrong at get categories, {response.message}</p>;
    }

    return (
        <div>
            <DataTable
                columns={columns}
                data={response.measurements}
                setData={null}
            />
        </div>
    );
}
