import React from "react";
import NotFound from "./not-found";
import Breadcrumbs from "@/components/breadcrumbs";
import EditForm from "@/components/forms/edit-form-product";
import { getCategories } from "@/lib/actions/category";
import { getProductById, getProperties } from "@/lib/actions/product";
import { getDiscounts } from "@/lib/actions/discounts";
import { getBrands } from "@/lib/actions/brand";
import { getCollections } from "@/lib/actions/collection";

export default async function EditProduct({
    params,
}: {
    params: { id: string };
}) {
    const id = params.id;
    const [product, categories, brands, collections, properties, discounts] =
        await Promise.all([
            getProductById(id),
            getCategories(),
            getBrands(),
            getCollections(),
            getProperties(),
            getDiscounts(),
        ]);
    if (!product) {
        return NotFound();
    }
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: "Products", href: "/dashboard/products" },
                    {
                        label: "Edit product",
                        href: `/dashboard/products/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <EditForm
                categories={categories || []}
                product={product}
                brands={brands || []}
                collections={collections || []}
                properties={properties || []}
                discounts={discounts || []}
            />
        </main>
    );
}
