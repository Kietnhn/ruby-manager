import GridCard from "@/components/brands/grid-card";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Card, CardBody } from "@nextui-org/react";
import Link from "next/link";
import React, { Suspense } from "react";

const BrandsPage = () => {
    return (
        <main>
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Brands</h3>
                <div className="flex items-center gap-4"></div>
            </div>
            <div className="mt-4 ">
                <Suspense fallback={<p>Loading...</p>}>
                    <GridCard />
                </Suspense>
            </div>
        </main>
    );
};

export default BrandsPage;
