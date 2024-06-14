"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Button, Input, InputProps } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent } from "react";
import { useDebouncedCallback } from "use-debounce";

interface Props extends InputProps {
    label: string;
    placeholder: string;
}
export default function InputSearch(props: Props) {
    const { label, placeholder, ...rest } = props;
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get("query");
    const handleChangeInput = useDebouncedCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set("query", value);
            } else {
                params.delete("query");
            }
            params.set("page", "1");
            // router.push(pathname + "?" + params.toString());
            router.replace(`${pathname}?${params.toString()}`);
        },
        300
    );

    return (
        <Input
            startContent={<MagnifyingGlassIcon className="w-5 h-5" />}
            label={label}
            placeholder={placeholder}
            variant="bordered"
            onChange={handleChangeInput}
            defaultValue={query || ""}
            {...rest}
        />
    );
}
