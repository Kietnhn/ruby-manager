import Breadcrumbs from "@/components/breadcrumbs";
import CreateForm from "@/components/forms/create-form-customer";
import { getCountries } from "@/lib/actions";
import React from "react";
export default async function CreateCustomerPage() {
    const { countries, message } = await getCountries();
    if (!countries) {
        return <p>{message}</p>;
    }
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: "Customers", href: "/dashboard/customers" },
                    {
                        label: "Create new customer",
                        href: "/dashboard/customers/create",
                        active: true,
                    },
                ]}
            />
            <CreateForm countries={countries} />
        </main>
    );
}
