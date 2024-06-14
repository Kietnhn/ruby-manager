"use client";

import { Suspense, useMemo, useState } from "react";
import InputSearch from "../search/input-search";
import {
    Badge,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Selection,
    cn,
} from "@nextui-org/react";
import { ChevronDownIcon, FunnelIcon } from "@heroicons/react/24/outline";
import ProductFilterOptions from "./filter-options";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MENU_SORT_BY } from "@/lib/constants";
import { SortByData } from "@/lib/definitions/product";

export default function FilterWrapper() {
    const [isShowFilterOptions, setIsShowFilterOptions] =
        useState<boolean>(false);
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const totalFiltered = useMemo(() => {
        let total = 0;
        searchParams.forEach((value, key) => {
            if (!["query", "page", "sort"].includes(key)) {
                total += 1;
            }
            console.log(value, key);
        });
        return total;
    }, [searchParams]);

    const sortSelectedKey = searchParams.get("sort") || "created-at-desc";
    const handleSelectSort = (keys: Selection) => {
        const key = Array.from(keys)[0];
        if (!key) return;
        const sortData = MENU_SORT_BY.find(
            (item) => item.key === key
        ) as SortByData;
        const params = new URLSearchParams(searchParams.toString());
        console.log({ params: params.toString() });

        params.set("sort", sortData.key);
        console.log({ paramsAfter: params.toString() });

        router.replace(`${pathname}?${params.toString()}`);
    };
    return (
        <div
            className={cn(
                "w-full flex flex-col  transition-all duration-300",
                !isShowFilterOptions ? "gap-0" : "gap-4"
            )}
        >
            <div className="flex gap-4 items-center">
                <div className="flex-1 flex gap-4 items-center">
                    <InputSearch
                        aria-label="Search products"
                        label=""
                        placeholder="Enter name or SKU of product"
                    />
                    <Badge
                        content={totalFiltered}
                        color={totalFiltered > 0 ? "primary" : "default"}
                    >
                        <Button
                            isIconOnly
                            variant="bordered"
                            onClick={() =>
                                setIsShowFilterOptions(!isShowFilterOptions)
                            }
                            color={totalFiltered > 0 ? "primary" : "default"}
                        >
                            <FunnelIcon className="w-6 h-6" />
                        </Button>
                    </Badge>
                </div>
                <div className="w-1/2 flex items-center justify-end">
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Button className="capitalize" variant="bordered">
                                Sort by <ChevronDownIcon className="w-5 h-5 " />
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="dropdown-sortby"
                            items={MENU_SORT_BY}
                            onSelectionChange={handleSelectSort}
                            disallowEmptySelection={false}
                            selectedKeys={
                                sortSelectedKey ? [sortSelectedKey] : undefined
                            }
                            selectionMode="single"
                            classNames={{
                                list: "max-h-60 overflow-y-auto custom-scrollbar",
                            }}
                        >
                            {(item) => (
                                <DropdownItem key={item.key}>
                                    {item.label}
                                </DropdownItem>
                            )}
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
            <div
                className={`  transition-all duration-300 overflow-hidden   ${
                    isShowFilterOptions ? "max-h-full p-0" : "max-h-0 p-0"
                }`}
            >
                <Suspense fallback={"Loading...."}>
                    <ProductFilterOptions />
                </Suspense>
            </div>
        </div>
    );
}
