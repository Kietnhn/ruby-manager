import { columns } from "@/app/dashboard/products/create/columns";
import { DataTable } from "../data-table";
import { Variation } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";

export default function TableVariations({
    variations,
    setVariations,
}: {
    variations: Variation[];
    setVariations: Dispatch<SetStateAction<Variation[]>>;
}) {
    return (
        <>
            <div className="container ">
                <DataTable
                    columns={columns}
                    data={variations}
                    setData={setVariations}
                />
            </div>
        </>
    );
}
