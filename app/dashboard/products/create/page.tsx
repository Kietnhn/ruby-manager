import Breadcrumbs from "@/components/breadcrumbs";
import { Metadata } from "next";
import CreateForm from "@/components/forms/create-form-product";
import { getCategories } from "@/lib/actions/category";
import { getProductDiscounts } from "@/lib/actions/discounts";
// import { getCollections } from "@/lib/actions/collection";
import { getBrands } from "@/lib/actions/brand";
import { getProperties } from "@/lib/actions/property";
import { getCountries } from "@/lib/actions";

export const metadata: Metadata = {
    title: "Create product",
};
export default async function Page() {
    const [
        categories,
        // collections,
        brands,
        properties,
        // discounts,
        // countries = [],
    ] = await Promise.all([
        getCategories(),
        // getCollections(),
        getBrands(),
        getProperties(),
        // getProductDiscounts(),
        // getCountries(),
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
                // collections={collections || []}
                properties={properties || []}
                // discounts={discounts || []}
                // countries={countries || []}
            />
        </main>
    );
}
