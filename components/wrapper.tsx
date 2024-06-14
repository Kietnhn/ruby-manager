"use client";

import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import { ReactNode } from "react";
import { motion } from "framer-motion";
export default function Wrapper({
    breadcrumbs,
    children,
    navigateButton,
}: {
    children: ReactNode;
    breadcrumbs: { label: string; href: string }[];
    navigateButton: ReactNode;
}) {
    return (
        <main className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <Breadcrumbs>
                    {breadcrumbs.map((breadcrumb) => (
                        <BreadcrumbItem
                            href={breadcrumb.href}
                            key={breadcrumb.label}
                        >
                            {breadcrumb.label}
                        </BreadcrumbItem>
                    ))}
                </Breadcrumbs>
                {navigateButton}
            </div>
            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-4"
            >
                {children}
            </motion.div>
        </main>
    );
}
