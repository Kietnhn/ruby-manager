import Breadcrumbs from "@/components/breadcrumbs";
import TablePages from "@/components/tables/table-pages";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import React, { Suspense } from "react";

const PagesPage = () => {
    return (
        <main>
            <div className="flex justify-between items-center mb-4">
                <Breadcrumbs
                    breadcrumbs={[{ label: "Pages", href: "#", active: true }]}
                    wrapper="mb-0"
                />
                <Link href={"/dashboard/pages/create"}>
                    <Button color="primary">
                        <PlusIcon className="w-5 h-5" />
                        Add new
                    </Button>
                </Link>
            </div>
            <div className="">
                <Suspense fallback={<div>Loading...</div>}>
                    <TablePages />
                </Suspense>
            </div>
        </main>
    );
};

export default PagesPage;
