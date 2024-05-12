import Breadcrumbs from "@/components/breadcrumbs";
import EditForm from "@/components/forms/edit-form-category";
import NotFound from "@/components/not-found";
import {
    getCategories,
    getCategoryById,
    getMeasurements,
} from "@/lib/actions/category";

export default async function EditCategoryPage({
    params,
}: {
    params: { id: string };
}) {
    const [category, categories, measurements] = await Promise.all([
        getCategoryById(params.id),
        getCategories(),
        getMeasurements(),
    ]);
    if (!category) {
        return <NotFound href="/dashboardd/categories" title="category" />;
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
            <EditForm
                categories={categories}
                currentCategory={category}
                measurements={measurements.measurements || []}
            />
        </main>
    );
}
