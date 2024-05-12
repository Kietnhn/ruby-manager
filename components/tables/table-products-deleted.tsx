import React from "react";
import { getDeletedProducts } from "@/lib/actions/product";

import { FlatProduct } from "@/lib/definitions";
import { DataTable } from "../data-table";
import { columns } from "@/app/dashboard/products/deleted/columns";
import { convertToFlatProducts } from "@/lib/utils";
import ImpExpButtons from "../ImpExpButtons";

export default async function TableProductsDeleted() {
    const delectedProducts = await getDeletedProducts();

    const flatProducts: FlatProduct[] = convertToFlatProducts(delectedProducts);

    return (
        <div className="container mx-auto ">
            <div className="mb-4">
                <h3 className="">
                    There were <strong>{delectedProducts.length}</strong>{" "}
                    products deleted
                </h3>

                {/* <ImpExpButtons
                    data={flatProducts}
                    impUrl="/dashboard/products/create/import "
                    nameFile="products"
                /> */}
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
