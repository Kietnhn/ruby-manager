import Breadcrumbs from "@/components/breadcrumbs";
import TableProducts from "@/components/tables/table-products";
import TabsBar from "@/components/tabs-bar";
import { TableCategoriesSkeleton } from "@/components/skeletons";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { Suspense } from "react";
import ProductTabsBar from "@/components/products/product-tabsbar";
import Wrapper from "@/components/wrapper";
import { getTotalPagesOfProduct } from "@/lib/actions/product";
import { convertToArray } from "@/lib/utils";
import { StyleGender } from "@prisma/client";
import { GENDERS, MENU_SORT_BY } from "@/lib/constants";
import InvalidUrl from "@/components/invalid-url";
import { SortByData } from "@/lib/definitions/product";

export default async function ProductsPage({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        page?: string;
        category?: string[] | string;
        brand?: string[] | string;
        collection?: string[] | string;
        gender?: string[] | string;
        property?: string;
        sort?: string;
    };
}) {
    const query = searchParams?.query || "";
    const currentPage = Number(searchParams?.page) || 1;
    const filterOptions = {
        category: convertToArray(searchParams?.category),
        brand: convertToArray(searchParams?.brand),
        collection: convertToArray(searchParams?.collection),
        gender: convertToArray(searchParams?.gender) as StyleGender[],
        property: convertToArray(searchParams?.property),
    };
    if (!filterOptions.gender.every((gender) => GENDERS.includes(gender))) {
        return <InvalidUrl />;
    }
    const sortOption = MENU_SORT_BY.find((item) => {
        const sortParam = searchParams?.sort;
        if (sortParam) {
            return item.key === sortParam;
        } else {
            return item.key === "created-at-desc"; //default
        }
    });
    console.log("filterOptions", filterOptions);
    console.log({ sortOption, query, currentPage });

    const totalPages = await getTotalPagesOfProduct(query, filterOptions);
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
                <TableProducts
                    query={query}
                    filterOptions={filterOptions}
                    sortOption={sortOption}
                    currentPage={currentPage}
                    totalPages={totalPages}
                />
            </Suspense>
        </Wrapper>
    );
}
