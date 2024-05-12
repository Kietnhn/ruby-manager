import TableOrders from "@/components/tables/table-orders";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import React, { Suspense } from "react";

const OrderPage = () => {
    return (
        <main>
            <div className="flex justify-between items-center mb-4">
                Orders
                <Link href="/dashboard/orders/create">
                    <Button color="primary">
                        <PlusIcon className="w-5 h-5" />
                        New
                    </Button>
                </Link>
            </div>
            <div className="">
                <Suspense fallback={<div>Loading...</div>}>
                    <TableOrders />
                </Suspense>
            </div>
        </main>
    );
};

export default OrderPage;
