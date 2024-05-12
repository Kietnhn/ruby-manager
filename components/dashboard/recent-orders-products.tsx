"use client";

import { getRecentOrders } from "@/lib/actions/dashboard";
import { use } from "react";
import CardWrapper from "../ui/card-wrapper";
import { ListRecentOrders } from "./list-link";

export default function RecentOrders() {
    const recentOrders = use(getRecentOrders());
    return (
        <CardWrapper heading="Recent orders" className="flex-1">
            <ListRecentOrders data={recentOrders} />
        </CardWrapper>
    );
}
