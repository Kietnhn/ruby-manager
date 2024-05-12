import { getCustomersDetail } from "@/lib/actions/user";
import React from "react";
import { DataTable } from "../data-table";
import { columns } from "@/app/dashboard/customers/columns";

export default async function TableCustomers() {
    const customers = await getCustomersDetail();
    if (!customers) {
        return <p>Somethings wrong at get customers</p>;
    }

    return (
        <div>
            <DataTable
                columns={columns}
                data={customers}
                setData={null}
                enableFilter={true}
                searchId="email"
                filterId="kind"
            />
        </div>
    );
}
