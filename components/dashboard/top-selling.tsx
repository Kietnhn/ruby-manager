"use client";

import { getTopSelling } from "@/lib/actions/dashboard";
import { use } from "react";
import CardWrapper from "../ui/card-wrapper";
import { DataTable } from "../data-table";
import { columns } from "@/app/dashboard/columns";

export default function TopSelling() {
    const topSelling = use(getTopSelling());
    return (
        <CardWrapper heading="Top selling products">
            <DataTable columns={columns} data={topSelling} setData={null} />
        </CardWrapper>
    );
}
