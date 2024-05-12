"use client";

import { Suspense } from "react";
import { InView } from "react-intersection-observer";
import { CardColItemSkeleton, CardFullItemSkeleton } from "../skeletons";
import TopSelling from "./top-selling";
import OutOfStock from "./out-of-stock-products";
import RecentOrders from "./recent-orders-products";

export default function ProductDashboard() {
    return (
        <InView triggerOnce>
            {({ inView, ref, entry }) => (
                <div className="flex gap-4" ref={ref}>
                    <div className="w-2/3 ">
                        {inView && (
                            <Suspense fallback={<CardFullItemSkeleton />}>
                                <TopSelling />
                            </Suspense>
                        )}
                    </div>
                    <div className="w-1/3">
                        {inView && (
                            <div className="h-full flex flex-col gap-4">
                                <Suspense fallback={<CardColItemSkeleton />}>
                                    <OutOfStock />
                                </Suspense>
                                <Suspense fallback={<CardColItemSkeleton />}>
                                    <RecentOrders />
                                </Suspense>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </InView>
    );
}
