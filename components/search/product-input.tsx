"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Button, Input } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function SearchProductInput() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const search = searchParams.get("search");
    const handleChangeInput = useDebouncedCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set("search", value);
            } else {
                params.delete("search");
            }
            router.push(pathname + "?" + params.toString());
        },
        300
    );

    return (
        <Input
            startContent={<MagnifyingGlassIcon className="w-5 h-5" />}
            label="Search product"
            placeholder="Enter name or SKU of product..."
            variant="bordered"
            onChange={handleChangeInput}
            defaultValue={search || ""}
        />
    );
}
