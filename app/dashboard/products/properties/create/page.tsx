import Breadcrumbs from "@/components/breadcrumbs";
import CreateForm from "@/components/forms/create-form-property";
import { getBrands, getCollections } from "@/lib/actions";
import { getCategories } from "@/lib/actions/category";

export default async function CreatePropertyPage() {
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: "Products", href: "/dashboard/products" },
                    {
                        label: "Properties",
                        href: "/dashboard/products/properties",
                    },
                    {
                        label: "Create new property",
                        href: "/dashboard/products/properties/create",
                        active: true,
                    },
                ]}
            />
            <div className="mt-8">
                <CreateForm />
            </div>
        </main>
    );
}
