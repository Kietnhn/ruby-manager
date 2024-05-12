import { auth } from "@/app/auth";
import Breadcrumbs from "@/components/breadcrumbs";
import CreateForm from "@/components/forms/create-form-order";
import { getCustomers } from "@/lib/actions/user";
import React from "react";
export default async function CreateCustomerPage() {
    const customers = await getCustomers();
    const session = await auth();
    // const products = await getAvailableProducts();
    if (!customers || !session)
        return <p>Somethings wrong at get CreateCustomerPage</p>;
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: "Orders", href: "/dashboard/orders" },
                    {
                        label: "Create new order",
                        href: "/dashboard/orders/create",
                        active: true,
                    },
                ]}
            />
            <CreateForm
                customers={customers}
                employee={session?.user?.email as string}
                // products={products}
            />
        </main>
    );
}
