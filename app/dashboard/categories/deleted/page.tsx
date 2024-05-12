import { TableCategoriesSkeleton } from "@/components/skeletons";

import React, { Suspense } from "react";
import TableDeletedCategories from "@/components/tables/table-categories-deleted";
import Breadcrumbs from "@/components/breadcrumbs";

export default async function CategoriesPage() {
    return (
        <main>
            <div className="">
                <Breadcrumbs
                    wrapper="mb-0"
                    breadcrumbs={[
                        {
                            href: "/dashboard/categories",
                            label: "Categories",
                        },
                        {
                            href: "/dashboard/categories/deleted",
                            label: "Deleted Categories",
                            active: true,
                        },
                    ]}
                />
            </div>

            <div className="mt-4 ">
                <Suspense fallback={<TableCategoriesSkeleton />}>
                    <TableDeletedCategories />
                </Suspense>
            </div>
        </main>
    );
}
