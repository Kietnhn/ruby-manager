import CreateForm from "@/components/forms/create-form-order";

import Wrapper from "@/components/wrapper";
import { findProducts } from "@/lib/actions/product";
import { getCustomers, protectedAction } from "@/lib/actions/user";
import React from "react";
export default async function CreateCustomerPage() {
    const [user] = await Promise.all([
        protectedAction(),
        // getCustomers(),
    ]);

    // if (!customers) return <p>Somethings wrong at get CreateCustomerPage</p>;
    return (
        <Wrapper
            breadcrumbs={[
                { label: "Orders", href: "/dashboard/orders" },
                {
                    label: "Create new order",
                    href: "/dashboard/orders/create",
                },
            ]}
            navigateButton={null}
        >
            {/* <div className="relative flex gap-4 flex-nowrap">
                <div className="w-2/3">
                    <div className="w-full flex flex-col gap-4">
                        <SearchProductInput />
                        <SearchProductResult />
                    </div>
                </div>
                <div className="w-1/3">
                    <CartOrder />
                </div>
            </div> */}
            {/* <CreateOrderForm /> */}
            <CreateForm employee={user.email as string} />
        </Wrapper>
    );
}
