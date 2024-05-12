import TableCategories from "@/components/tables/table-categories";
import { TableCategoriesSkeleton } from "@/components/skeletons";
import {
    AdjustmentsHorizontalIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import React, { Suspense } from "react";
import TabsBar from "@/components/tabs-bar";
import Breadcrumbs from "@/components/breadcrumbs";

export default async function CategoriesPage() {
    return (
        <main>
            <div className="flex justify-between items-center">
                <Breadcrumbs
                    wrapper="mb-0"
                    breadcrumbs={[
                        {
                            href: "/dashboard/categories",
                            label: "Categories",
                            active: true,
                        },
                    ]}
                />
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/categories/measurements">
                        <Button color="success">
                            <AdjustmentsHorizontalIcon className="w-5 h-5" />{" "}
                            Measurement
                        </Button>
                    </Link>
                    <Link href="/dashboard/categories/create">
                        <Button color="primary">
                            <PlusIcon className="w-5 h-5" /> New
                        </Button>
                    </Link>
                </div>
            </div>
            <TabsBar
                tabs={[
                    {
                        href: "/dashboard/categories",
                        title: "Active",
                    },
                    {
                        href: "/dashboard/categories/deleted",
                        title: "Deleted",
                    },
                ]}
            />
            <div className="mt-4 ">
                <Suspense fallback={<TableCategoriesSkeleton />}>
                    <TableCategories />
                </Suspense>
            </div>
        </main>
    );
}
