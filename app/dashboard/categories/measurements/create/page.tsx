import Breadcrumbs from "@/components/breadcrumbs";
import React from "react";
import CreateForm from "../../../../../components/forms/create-form-measurement";

const CreateMeasurement = () => {
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    {
                        label: "Measurements",
                        href: "/dashboard/categories/measurements",
                    },
                    {
                        label: "Create new measurement",
                        href: "/dashboard/categories/measurements/create",
                        active: true,
                    },
                ]}
            />
            <div className="mt-4">
                <CreateForm />
            </div>
        </main>
    );
};

export default CreateMeasurement;
