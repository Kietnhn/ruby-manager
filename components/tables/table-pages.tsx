import { getPages } from "@/lib/actions/page";
import React from "react";
import { DataTable } from "../data-table";
import { columns } from "@/app/dashboard/pages/columns";

export default async function TablePages() {
    const pages = await getPages();
    if (!pages) {
        return <p>Somethings wrong at get customers</p>;
    }

    return (
        <DataTable
            columns={columns}
            data={pages}
            setData={null}
            enableFilter={true}
            searchId="title"
            filterId="visibility"
        />
    );
}
