import { Metadata } from "next";

import MainDashboard from "@/components/dashboard/main-dashboard";
import ProductDashboard from "@/components/dashboard/product-dashboard";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Dashboard",
};
export default async function DashboardPage() {
    return (
        <main className="flex flex-col gap-4 py-12">
            {/* load at first */}
            <Suspense fallback={"loading..."}>
                <MainDashboard />
            </Suspense>
            {/* scroll to load */}
            <ProductDashboard />
        </main>
    );
}
