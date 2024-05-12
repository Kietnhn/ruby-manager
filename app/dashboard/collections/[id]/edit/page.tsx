import Breadcrumbs from "@/components/breadcrumbs";
import EditFormCollection from "@/components/forms/edit-form-collection";
import NotFound from "@/components/not-found";
import { getCollectionById } from "@/lib/actions";
import { getProducts } from "@/lib/actions/product";

export default async function CollectionDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const [collection, products] = await Promise.all([
        getCollectionById(params.id),
        getProducts(),
    ]);
    if (!products) return <p>No products</p>;
    if (!collection) {
        return (
            <NotFound href="/dashboard/collections" title="collection detail" />
        );
    }
    return (
        <main>
            <div className="flex mb-4">
                <Breadcrumbs
                    breadcrumbs={[
                        {
                            href: "/dashboard/collections",
                            label: "Collections",
                        },
                        {
                            href: `/dashboard/collections/${params.id}`,
                            label: "Collection details",
                            active: true,
                        },
                    ]}
                />
            </div>
            <div className="">
                <EditFormCollection
                    collection={collection}
                    products={products}
                />
            </div>
        </main>
    );
}
