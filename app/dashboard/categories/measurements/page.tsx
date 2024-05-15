import { DataTable } from "@/components/data-table";

import Wrapper from "@/components/wrapper";
import { getMeasurements } from "@/lib/actions/category";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import { columns } from "@/app/dashboard/categories/measurements/columns";
export default async function MeasurementPage() {
    const measurements = await getMeasurements();
    if (!measurements) {
        return <p>Somethings wrong at get measurement</p>;
    }

    return (
        <Wrapper
            navigateButton={
                <Link href="/dashboard/categories/measurements/create">
                    <Button color="primary">
                        <PlusIcon className="w-5 h-5" /> New
                    </Button>
                </Link>
            }
            breadcrumbs={[
                {
                    href: "/dashboard/categories",
                    label: "Category",
                },
                {
                    href: "/dashboard/categories/measurements",
                    label: "Measurements",
                },
            ]}
        >
            <DataTable columns={columns} data={measurements} setData={null} />
        </Wrapper>
    );
}
