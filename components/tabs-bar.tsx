// app/tabs/page.tsx
"use client";

import { usePathname } from "next/navigation";
import { Tabs, Tab } from "@nextui-org/react";
export default function TabsBar({
    tabs,
}: {
    tabs: { href: string; title: string }[];
}) {
    const pathname = usePathname();

    return (
        <Tabs
            aria-label="tabs-bar-products"
            selectedKey={pathname}
            variant="underlined"
        >
            {tabs.map((tab) => (
                <Tab key={tab.href} title={tab.title} href={tab.href} />
            ))}
        </Tabs>
    );
}
