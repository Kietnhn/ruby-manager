import Breadcrumbs from "@/components/breadcrumbs";
import React from "react";
import CreateForm from "@/components/forms/create-form-category";
import { getCategories, getMeasurements } from "@/lib/actions/category";

export default async function CreateCategory() {
    const categories = await getCategories();
    const response = await getMeasurements();

    if (!categories) {
        return <p className="text-red-500">Not found categories</p>;
    }
    if (!response.measurements) {
        return <p className="text-red-500">{response.message}</p>;
    }
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: "Categories", href: "/dashboard/categories" },
                    {
                        label: "Create new category",
                        href: "/dashboard/categories/create",
                        active: true,
                    },
                ]}
            />
            <div className="mt-12">
                <CreateForm
                    categories={categories}
                    measurements={response.measurements}
                />
            </div>
        </main>
    );
}
