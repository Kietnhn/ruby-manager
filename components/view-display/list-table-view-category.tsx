"use client";

import TabsBar from "@/components/tabs-bar";
import { ICategory } from "@/lib/definitions";
import { useState } from "react";
import { DataTable } from "../data-table";
import { columns } from "@/app/dashboard/categories/columns";
import CategoryTree from "../category-tree";
import { Button, ButtonGroup } from "@nextui-org/react";
import { ListBulletIcon, TableCellsIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
export default function ListTableViewCategory({
    tabs,
    categories,
}: {
    tabs: { href: string; title: string }[];
    categories: ICategory[];
}) {
    const [display, setDisplay] = useState<"list" | "table">("table");
    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <TabsBar tabs={tabs} />
                <ButtonGroup>
                    <Button
                        isIconOnly
                        size="sm"
                        color={display === "table" ? "primary" : "default"}
                        onClick={() => setDisplay("table")}
                    >
                        <TableCellsIcon className="w-5 h-5" />
                    </Button>
                    <Button
                        isIconOnly
                        size="sm"
                        color={display === "list" ? "primary" : "default"}
                        onClick={() => setDisplay("list")}
                    >
                        <ListBulletIcon className="w-5 h-5" />
                    </Button>
                </ButtonGroup>
            </div>

            <div className="">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={display}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {display === "table" ? (
                            <DataTable
                                columns={columns}
                                data={categories}
                                setData={null}
                            />
                        ) : (
                            <CategoryTree categories={categories} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
