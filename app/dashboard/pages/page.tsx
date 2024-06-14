import Breadcrumbs from "@/components/breadcrumbs";
import TablePages from "@/components/tables/table-pages";
import Wrapper from "@/components/wrapper";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import React, { Suspense } from "react";

const PagesPage = () => {
    return (
        <Wrapper
            breadcrumbs={[{ label: "Pages", href: "/dashboard/pages" }]}
            navigateButton={
                <Link href={"/dashboard/pages/create"}>
                    <Button color="primary">
                        <PlusIcon className="w-5 h-5" />
                        Add new
                    </Button>
                </Link>
            }
        >
            <Suspense fallback={<div>Loading...</div>}>
                <TablePages />
            </Suspense>
        </Wrapper>
    );
};

export default PagesPage;
