import Breadcrumbs from "@/components/breadcrumbs";
import { Metadata } from "next";
import CreateForm from "@/components/forms/create-form-product";
import { getBrands, getCollections } from "@/lib/actions";
import { getCategories } from "@/lib/actions/category";
import { getProperties } from "@/lib/actions/product";
import { getProductDiscounts } from "@/lib/actions/discounts";

export const metadata: Metadata = {
    title: "Create product",
};
export default async function Page() {
    const [categories, collections, brands, properties, discounts] =
        await Promise.all([
            getCategories(),
            getCollections(),
            getBrands(),
            getProperties(),
            getProductDiscounts(),
        ]);

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: "Products", href: "/dashboard/products" },
                    {
                        label: "Create new product",
                        href: "/dashboard/products/create",
                        active: true,
                    },
                ]}
            />
            <CreateForm
                categories={categories || []}
                brands={brands || []}
                collections={collections || []}
                properties={properties || []}
                discounts={discounts || []}
            />
        </main>
    );
}
