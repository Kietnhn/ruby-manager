import React from "react";
import { DataTable } from "../data-table";
import { getProperties } from "@/lib/actions/product";
import NotFound from "../not-found";
import { columns } from "@/app/dashboard/products/properties/columns";
import { groupPropertiesByName } from "@/lib/utils";

export default async function TableProperties() {
    const properties = await getProperties();
    if (!properties) {
        return <NotFound href="/dashboard/products" title="Properties" />;
    }
    const groupedProperties = groupPropertiesByName(properties);
    return (
        <div>
            <DataTable
                columns={columns}
                data={groupedProperties}
                setData={null}
            />
        </div>
    );
}
