import Breadcrumbs from "@/components/breadcrumbs";
import EditForm from "@/components/forms/edit-form-measurement";
import NotFound from "@/components/not-found";
import { getMeasurementById } from "@/lib/actions/category";

export default async function EditMeasurementPage({
    params,
}: {
    params: { id: string };
}) {
    const measurement = await getMeasurementById(params.id);
    if (!measurement) {
        return (
            <NotFound
                href="/dashboardd/categories/measurements"
                title="Measurements"
            />
        );
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: "Categories", href: "/dashboard/categories" },
                    {
                        label: "Edit product",
                        href: `/dashboard/categories/${params.id}/edit`,
                        active: true,
                    },
                ]}
            />
            <EditForm currentMeasurement={measurement} />
        </main>
    );
}
