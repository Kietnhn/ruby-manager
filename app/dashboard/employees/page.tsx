import AccessForbidden from "@/components/access-forbidden";
import Breadcrumbs from "@/components/breadcrumbs";
import { TableSkeleton } from "@/components/skeletons";
import TableEmployees from "@/components/tables/table-employees";
import { getUserRole } from "@/lib/actions/user";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import React, { Suspense } from "react";

const EmployeesPage = async () => {
    const userRole = await getUserRole();
    if (!userRole || userRole === "EMPLOYEE") {
        return <AccessForbidden />;
    }
    return (
        <main className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
                <Breadcrumbs
                    breadcrumbs={[
                        {
                            label: "Employees",
                            href: "/dashboard/employees",
                            active: true,
                        },
                    ]}
                    wrapper="mb-0"
                />
                <Link href="/dashboard/employees/create">
                    <Button color="primary">
                        <PlusIcon className="w-5 h-5" />
                        New
                    </Button>
                </Link>
            </div>
            <div className="flex-1">
                <Suspense fallback={<TableSkeleton />}>
                    <TableEmployees />
                </Suspense>
            </div>
        </main>
    );
};

export default EmployeesPage;
