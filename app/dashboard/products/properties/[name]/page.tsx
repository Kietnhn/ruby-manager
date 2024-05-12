import Breadcrumbs from "@/components/breadcrumbs";
import NotFound from "@/components/not-found";
import { TableCategoriesSkeleton } from "@/components/skeletons";
import TableGroupProperties from "@/components/tables/table-group-properties";
import { getPropertiesByName } from "@/lib/actions/product";
import { toCapitalize } from "@/lib/utils";
import { Suspense } from "react";

export default async function EditPropertyPage({
    params,
}: {
    params: { name: string };
}) {
    const properties = await getPropertiesByName(params.name);
    if (!properties || properties.length === 0) {
        return (
            <NotFound
                href="/dashboard/products/properties"
                title={` property ${params.name} not found`}
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
                        label: `${toCapitalize(params.name)}`,
                        href: `/dashboard/products/properties/${params.name}`,
                        active: true,
                    },
                ]}
            />
            <Suspense fallback={<TableCategoriesSkeleton />}>
                <TableGroupProperties properties={properties} />
            </Suspense>
        </main>
    );
}
