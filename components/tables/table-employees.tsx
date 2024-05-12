import { getEmployees } from "@/lib/actions/user";
import React from "react";
import { DataTable } from "../data-table";
import { columns } from "@/app/dashboard/employees/columns";

export default async function TableEmployees() {
    const employees = await getEmployees();
    if (!employees) {
        return <p>Somethings wrong at get employees</p>;
    }

    return (
        <DataTable
            columns={columns}
            data={employees}
            setData={null}
            enableFilter={true}
            searchId="email"
            filterId="kind"
        />
    );
}
