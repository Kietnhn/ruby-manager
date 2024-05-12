import { Suspense } from "react";
import { Card } from "@nextui-org/react";
import ProductsOrderedByBrand from "./products-ordered-by-brand";
import LineChart from "../charts/line-chart";
// import TopCustomers from "./server-functions";
import { CardColItemSkeleton, CardItemSkeleton } from "../skeletons";
import dynamic from "next/dynamic";
import {
    DiscountCard,
    NumberOfOrdersCard,
    NumberOfUserCard,
    RevenueCard,
} from "./server-functions";
// const CardOverview = dynamic(() => import('./card-overview'), {
//     ssr: false,
// })
// const ProductsOrderedByBrand = dynamic(
//     () => import("./products-ordered-by-brand"),
//     {
//         ssr: false,
//     }
// );
const TopCustomers = dynamic(() => import("./server-functions"), {
    ssr: false,
});
export default function MainDashboard() {
    return (
        <div className="w-full h-screen flex gap-4">
            <div className="w-2/3 flex flex-col gap-4">
                <div className="flex gap-4">
                    <div className="w-1/4">
                        <Suspense fallback={<CardItemSkeleton />}>
                            <RevenueCard />
                        </Suspense>
                    </div>
                    <div className="w-1/4">
                        <Suspense fallback={<CardItemSkeleton />}>
                            <NumberOfUserCard />
                        </Suspense>
                    </div>
                    <div className="w-1/4">
                        <Suspense fallback={<CardItemSkeleton />}>
                            <DiscountCard />
                        </Suspense>
                    </div>
                    <div className="w-1/4">
                        <Suspense fallback={<CardItemSkeleton />}>
                            <NumberOfOrdersCard />
                        </Suspense>
                    </div>
                </div>

                <Card className="flex-1 p-3">
                    <LineChart />
                </Card>
            </div>
            <div className="w-1/3 flex flex-col gap-4">
                <Suspense fallback={<CardColItemSkeleton />}>
                    <ProductsOrderedByBrand />
                </Suspense>
                <Suspense fallback={<CardColItemSkeleton />}>
                    <TopCustomers />
                </Suspense>
            </div>
        </div>
    );
}
