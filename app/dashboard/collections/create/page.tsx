import Breadcrumbs from "@/components/breadcrumbs";
import CreateFormCollection from "@/components/forms/create-form-collection";
import { getProducts } from "@/lib/actions/product";

export default async function CreateCollectionPage() {
    const products = await getProducts();
    if (!products) {
        return <p>{"Not products"}</p>;
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
                            href: "/dashboard/collections/create",
                            label: "Create a collection",
                            active: true,
                        },
                    ]}
                />
            </div>
            <div className="">
                <CreateFormCollection products={products} />
            </div>
        </main>
    );
}
