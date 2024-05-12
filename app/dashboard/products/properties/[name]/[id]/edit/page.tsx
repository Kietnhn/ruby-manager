import Breadcrumbs from "@/components/breadcrumbs";
import EditForm from "@/components/forms/edit-form-property";
import NotFound from "@/components/not-found";
import { getPropertyById } from "@/lib/actions/product";

export default async function EditPropertyPage({
    params,
}: {
    params: { id: string };
}) {
    const property = await getPropertyById(params.id);
    if (!property) {
        return (
            <NotFound
                href="/dashboard/products/properties"
                title="Edut property"
            />
        );
    }
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
                        label: "Edit property",
                        href: `/dashboard/products/properties/${params.id}/edit}`,
                        active: true,
                    },
                ]}
            />
            <div className="mt-8">
                <EditForm currentProperty={property} />
            </div>
        </main>
    );
}
