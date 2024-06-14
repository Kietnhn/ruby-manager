import React from "react";
import { getProducts, searchProducts } from "@/lib/actions/product";

import { FlatProduct, FullProduct } from "@/lib/definitions";
import { DataTable } from "../data-table";
import { columns } from "@/app/dashboard/products/columns";
import { convertToFlatProducts } from "@/lib/utils";
import ImpExpButtons from "../ImpExpButtons";
import { Button, Input, Pagination } from "@nextui-org/react";
import { FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import InputSearch from "../search/input-search";
import PaginationTable from "../pagination";
import FilterWrapper from "../products/filter-wrapper";
import { ProductFilterOptions, SortByData } from "@/lib/definitions/product";

export default async function TableProducts({
    query,
    filterOptions,
    currentPage,
    totalPages,
    sortOption,
}: {
    query: string;
    filterOptions: ProductFilterOptions;
    sortOption: SortByData | undefined;
    currentPage: number;
    totalPages: number;
}) {
    const products = await searchProducts({
        value: query,
        filterOptions: filterOptions,
        page: currentPage - 1,
        sortOption: sortOption,
    });

    const flatProducts: FlatProduct[] = convertToFlatProducts(products);

    return (
        <div className="container mx-auto flex flex-col gap-4">
            <FilterWrapper />
            {/* <div className="mb-4">
                <h3 className="">
                    There are <strong>{products.length}</strong> products in
                    store
                </h3>

                <ImpExpButtons
                    impData={products}
                    data={flatProducts}
                    impUrl="/dashboard/products/create/import "
                    nameFile="products"
                />
            </div> */}
            <DataTable
                columns={columns}
                data={flatProducts}
                setData={null}
                isUsePagination={false}
                // enableFilter={true}
                // searchId="name"
                // filterId="category"
            />
            {totalPages > 1 && (
                <div className="my-4 flex items-center justify-end px-4">
                    <PaginationTable total={totalPages} />
                </div>
            )}
        </div>
    );
}
