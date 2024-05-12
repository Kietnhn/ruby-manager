import Breadcrumbs from "@/components/breadcrumbs";
import { TableSkeleton } from "@/components/skeletons";
import TableCustomers from "@/components/tables/table-customers";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import React, { Suspense } from "react";

const CustomesPage = () => {
    return (
        <main className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
                <Breadcrumbs
                    breadcrumbs={[
                        {
                            label: "Customers",
                            href: "/dashboard/customers",
                            active: true,
                        },
                    ]}
                    wrapper="mb-0"
                />
                <Link href="/dashboard/customers/create">
                    <Button color="primary">
                        <PlusIcon className="w-5 h-5" />
                        New
                    </Button>
                </Link>
            </div>
            <div className="flex-1">
                <Suspense fallback={<TableSkeleton />}>
                    <TableCustomers />
                </Suspense>
            </div>
        </main>
    );
};

export default CustomesPage;
