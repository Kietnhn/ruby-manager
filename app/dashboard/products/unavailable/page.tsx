import Breadcrumbs from "@/components/breadcrumbs";
import { DataTable } from "@/components/data-table";
import TabsBar from "@/components/tabs-bar";
import { getUnAvailableProducts } from "@/lib/actions/product";
import { convertToFlatProducts } from "@/lib/utils";
import { columns } from "../columns";
import ProductTabsBar from "@/components/products/product-tabsbar";

export default async function ProductsUnAvailablePage() {
    const unAvailableProducts = await getUnAvailableProducts();
    const flatProducts = convertToFlatProducts(unAvailableProducts);
    return (
        <main className="">
            <div className="flex items-center justify-between ">
                <Breadcrumbs
                    wrapper="mb-0"
                    breadcrumbs={[
                        {
                            href: "/dashboard/products",
                            label: "Products",
                            active: true,
                        },
                    ]}
                />
            </div>
            <div className="mt-8 ">
                <ProductTabsBar />

                <div className="">
                    <div className="mb-4">
                        <h3 className="">
                            There were <strong>{flatProducts.length}</strong>{" "}
                            products unavailable to sale
                        </h3>
                        <DataTable
                            columns={columns}
                            data={flatProducts}
                            setData={null}
                            enableFilter={true}
                            searchId="name"
                            filterId="category"
                        />
                        {/* <ImpExpButtons
                    data={flatProducts}
                    impUrl="/dashboard/products/create/import "
                    nameFile="products"
                /> */}
                    </div>
                </div>
            </div>
        </main>
    );
}
