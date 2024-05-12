"use client";

import { usePathname } from "next/navigation";
import { Tabs, Tab } from "@nextui-org/react";
export default function Tabsbar() {
    const pathname = usePathname();
    console.log(pathname);

    return (
        <Tabs
            aria-label="Options"
            selectedKey={pathname}
            variant="underlined"
            className="mb-4"
        >
            <Tab
                key="/dashboard/users/customers"
                title="Customers"
                href="/dashboard/users/customers"
            />
            <Tab
                key="/dashboard/users/employees"
                title="Employees"
                href="/dashboard/users/employees"
            />
        </Tabs>
    );
}
