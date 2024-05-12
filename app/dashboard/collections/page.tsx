import Breadcrumbs from "@/components/breadcrumbs";
import GridCard from "@/components/collections/grid-card";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import React, { Suspense } from "react";

const CollectionsPage = () => {
    return (
        <main>
            <div className="flex justify-between items-center mb-4">
                <Breadcrumbs
                    breadcrumbs={[
                        { label: "Collections", href: "#", active: true },
                    ]}
                    wrapper="mb-0"
                />
                <Link href={"/dashboard/collections/create"}>
                    <Button color="primary">
                        <PlusIcon className="w-5 h-5" />
                        Add new
                    </Button>
                </Link>
            </div>
            <div>
                <Suspense fallback={<p>Loading ...</p>}>
                    <GridCard />
                </Suspense>
            </div>
        </main>
    );
};

export default CollectionsPage;
