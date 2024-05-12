import Breadcrumbs from "@/components/breadcrumbs";
import CreateBrandForm from "@/components/forms/create-form-brand";
import React from "react";

const CreateBrandPage = () => {
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: "Brands", href: "/dashboard/brands" },
                    {
                        label: "Create new brand",
                        href: "/dashboard/brands/create",
                        active: true,
                    },
                ]}
            />
            <div className="">
                <CreateBrandForm />
            </div>
        </main>
    );
};

export default CreateBrandPage;
