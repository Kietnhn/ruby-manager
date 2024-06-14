import TableProducts from "@/components/tables/table-products";
import { TableCategoriesSkeleton } from "@/components/skeletons";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { Suspense } from "react";
import ProductTabsBar from "@/components/products/product-tabsbar";
import Wrapper from "@/components/wrapper";

export default async function ProductsPage() {
    return (
        <Wrapper
            breadcrumbs={[{ href: "/dashboard/products", label: "Products" }]}
            navigateButton={
                <Link href="/dashboard/products/create">
                    <Button color="primary">
                        <PlusIcon className="w-5 h-5" />
                        Add product
                    </Button>
                </Link>
            }
        >
            <ProductTabsBar />
            <Suspense fallback={<TableCategoriesSkeleton />}>
                <TableProducts />
            </Suspense>
        </Wrapper>
    );
}
