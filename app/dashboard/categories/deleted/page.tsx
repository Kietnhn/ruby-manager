import React from "react";
import Wrapper from "@/components/wrapper";
import { getDeletedCategories } from "@/lib/actions/category";
import { DataTable } from "@/components/data-table";
import { columns } from "@/app/dashboard/categories/deleted/columns";

export default async function CategoriesPage() {
    const deletedCategories = await getDeletedCategories();
    if (!deletedCategories) {
        return <p>Somethings wrong at get deletedCategories</p>;
    }

    return (
        <Wrapper
            breadcrumbs={[
                {
                    href: "/dashboard/categories",
                    label: "Categories",
                },
                {
                    href: "/dashboard/categories/deleted",
                    label: "Deleted Categories",
                },
            ]}
            navigateButton={null}
        >
            <DataTable
                columns={columns}
                data={deletedCategories}
                setData={null}
            />
        </Wrapper>
    );
}
