"use client";

import { getOutOfStockProducts } from "@/lib/actions/dashboard";
import { use } from "react";
import CardWrapper from "../ui/card-wrapper";
import { ListsOutOfStockProducts } from "./list-link";

export default function OutOfStock() {
    const outOfStockProducts = use(getOutOfStockProducts());
    return (
        <CardWrapper heading="Out of stock">
            <ListsOutOfStockProducts data={outOfStockProducts} />
        </CardWrapper>
    );
}
