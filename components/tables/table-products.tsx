import React from "react";
import { getProducts } from "@/lib/actions/product";

import { FlatProduct, FullProduct } from "@/lib/definitions";
import { DataTable } from "../data-table";
import { columns } from "@/app/dashboard/products/columns";
import { convertToFlatProducts } from "@/lib/utils";
import ImpExpButtons from "../ImpExpButtons";

export default async function TableProducts() {
    const products = await getProducts();
    if (!products) {
        return <p className="text-red-500">{"not products"}</p>;
    }

    const flatProducts: FlatProduct[] = convertToFlatProducts(products);

    return (
        <div className="container mx-auto ">
            <div className="mb-4">
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
            </div>
            <DataTable
                columns={columns}
                data={flatProducts}
                setData={null}
                enableFilter={true}
                searchId="name"
                filterId="category"
            />
        </div>
    );
}
