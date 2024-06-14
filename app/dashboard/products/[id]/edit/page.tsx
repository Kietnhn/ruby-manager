import React from "react";
import NotFound from "./not-found";
import Breadcrumbs from "@/components/breadcrumbs";
import EditForm from "@/components/forms/edit-form-product";
import { getCategories } from "@/lib/actions/category";
import { deleteProduct, getProductById } from "@/lib/actions/product";
import { getDiscounts } from "@/lib/actions/discounts";
import { getBrands } from "@/lib/actions/brand";
import { getCollections } from "@/lib/actions/collection";
import { getProperties } from "@/lib/actions/property";
import Wrapper from "@/components/wrapper";
import { ConfirmDelete, ViewLinkButton } from "@/components/buttons";

export default async function EditProduct({
    params,
}: {
    params: { id: string };
}) {
    const id = params.id;
    const [product, categories, brands, properties] = await Promise.all([
        getProductById(id),
        getCategories(),
        getBrands(),
        getProperties(),
    ]);
    if (!product) {
        return NotFound();
    }
    const deleteProductWithId = deleteProduct.bind(null, id);
    return (
        <Wrapper
            breadcrumbs={[
                { label: "Products", href: "/dashboard/products" },
                {
                    label: "Edit product",
                    href: `/dashboard/products/${id}/edit`,
                },
            ]}
            navigateButton={
                <div className="flex gap-4">
                    <ViewLinkButton
                        href={`/dashboard/products/${id}`}
                        content="View product"
                        isShowTitle={true}
                    />
                    <ConfirmDelete
                        action={deleteProductWithId}
                        name="Product"
                        isShowTitle={true}
                    />
                </div>
            }
        >
            <EditForm
                categories={categories || []}
                product={product}
                brands={brands || []}
                properties={properties || []}
            />
        </Wrapper>
    );
}
