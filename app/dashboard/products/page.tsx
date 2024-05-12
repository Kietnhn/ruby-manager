import Breadcrumbs from "@/components/breadcrumbs";
import TableProducts from "@/components/tables/table-products";
import TabsBar from "@/components/tabs-bar";
import { TableCategoriesSkeleton } from "@/components/skeletons";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { Suspense } from "react";
import ProductTabsBar from "@/components/products/product-tabsbar";

export default async function ProductsPage() {
    return (
        <main className="">
            <div className="flex items-center justify-between ">
                <div className="">
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
                <Link href="/dashboard/products/create">
                    <Button color="primary">
                        <PlusIcon className="w-5 h-5" />
                        Add product
                    </Button>
                </Link>
            </div>
            <div className="mt-8 ">
                <ProductTabsBar />
                <Suspense fallback={<TableCategoriesSkeleton />}>
                    <TableProducts />
                </Suspense>
            </div>
        </main>
    );
}
