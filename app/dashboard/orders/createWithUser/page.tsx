import Breadcrumbs from "@/components/breadcrumbs";
// import CreateForm from "@/components/form/create-form-with-user";
import React from "react";
export default async function CreateCustomerWithUserPage() {
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: "Orders", href: "/dashboard/orders" },
                    {
                        label: "Create new order with user",
                        href: "/dashboard/orders/createWithUser",
                        active: true,
                    },
                ]}
            />
            {/* <CreateForm /> */}
        </main>
    );
}
