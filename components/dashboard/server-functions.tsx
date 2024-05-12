import { CircleDollarSignIcon, PercentIcon } from "lucide-react";
import { DataTable } from "../data-table";
import CardWrapper from "../ui/card-wrapper";
import CardItem from "./card-item";
import {
    ListRecentOrders,
    ListTopCustomer,
    ListsOutOfStockProducts,
} from "./list-link";
import { columns } from "@/app/dashboard/columns";
import {
    getAllRevenue,
    getNumberOfOrders,
    getNumberOfUsers,
    getOutOfStockProducts,
    getRecentOrders,
    getTopCustomer,
    getTopSelling,
} from "@/lib/actions/dashboard";
import { renderPrice } from "@/lib/utils";

import {
    DocumentDuplicateIcon,
    UserGroupIcon,
} from "@heroicons/react/24/outline";

export default async function TopCustomers() {
    const topCustomers = await getTopCustomer();

    return (
        <CardWrapper heading="Top customers">
            <ListTopCustomer data={topCustomers} />
        </CardWrapper>
    );
}
export async function RevenueCard() {
    const revenue = await getAllRevenue();
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    return (
        <CardItem
            amount={renderPrice(revenue)}
            title="Revenues"
            icon={<CircleDollarSignIcon className="w-5 h-5" />}
            trending="increase"
            className="w-full"
        />
    );
}

export async function NumberOfUserCard() {
    const numberOfUser = await getNumberOfUsers();
    return (
        <CardItem
            amount={numberOfUser.toString()}
            title="Customers"
            icon={<UserGroupIcon className="w-5 h-5" />}
            trending="increase"
            className="w-full"
        />
    );
}
export async function DiscountCard() {
    return (
        <CardItem
            amount={"0"}
            title="Discounts"
            icon={<PercentIcon className="w-5 h-5" />}
            trending="balance"
            className="w-full"
        />
    );
}
export async function NumberOfOrdersCard() {
    const numberOfOrders = await getNumberOfOrders();
    return (
        <CardItem
            amount={numberOfOrders.toString()}
            title="Orders"
            icon={<DocumentDuplicateIcon className="w-5 h-5" />}
            trending="decrease"
            className="w-full"
        />
    );
}
