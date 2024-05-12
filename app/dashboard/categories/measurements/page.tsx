import { TableCategoriesSkeleton } from "@/components/skeletons";
import TableMeasurements from "@/components/tables/table-measurements";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button, Input, Textarea } from "@nextui-org/react";
import Link from "next/link";
import React, { Suspense } from "react";

export default function MeasurementPage() {
    return (
        <main>
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Measurement</h3>
                <Link href="/dashboard/categories/measurements/create">
                    <Button color="primary">
                        <PlusIcon className="w-5 h-5" /> New
                    </Button>
                </Link>
            </div>

            <div className="mt-4 ">
                <Suspense fallback={<TableCategoriesSkeleton />}>
                    <TableMeasurements />
                </Suspense>
            </div>
        </main>
    );
}
