import Breadcrumbs from "@/components/breadcrumbs";
import { TableCategoriesSkeleton } from "@/components/skeletons";
import TableProperties from "@/components/tables/table-properties";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { Suspense } from "react";

export default function ProductsPage() {
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
                            },
                            {
                                href: "/dashboard/products/properties",
                                label: "Properties",
                                active: true,
                            },
                        ]}
                    />
                </div>
                <Link href="/dashboard/products/properties/create">
                    <Button color="primary">
                        <PlusIcon className="w-5 h-5" />
                        Add property
                    </Button>
                </Link>
            </div>
            <div className="mt-8 ">
                <Suspense fallback={<TableCategoriesSkeleton />}>
                    <TableProperties />
                </Suspense>
            </div>
        </main>
    );
}
