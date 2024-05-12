import Breadcrumbs from "@/components/breadcrumbs";
import TableProductsDeleted from "@/components/tables/table-products-deleted";
import TabsBar from "@/components/tabs-bar";
import { TableCategoriesSkeleton } from "@/components/skeletons";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { Suspense } from "react";
import ProductTabsBar from "@/components/products/product-tabsbar";

export default function ProductsDeletedPage() {
    return (
        <main className="">
            <div className="flex items-center justify-between ">
                <Breadcrumbs
                    wrapper="mb-0"
                    breadcrumbs={[
                        {
                            href: "/dashboard/products",
                            label: "Products",
                            active: true,
                        },
                    ]}
                />
            </div>
            <div className="mt-8 ">
                <ProductTabsBar />

                <Suspense fallback={<TableCategoriesSkeleton />}>
                    <TableProductsDeleted />
                </Suspense>
            </div>
        </main>
    );
}
