"use client";

import { Pagination, PaginationProps } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function PaginationTable(props: PaginationProps) {
    const { total, initialPage = 1 } = props;
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || initialPage;
    console.log({ searchParams: searchParams.toString() });

    const handleChangePagination = (e: number) => {
        const params = new URLSearchParams(searchParams.toString());
        console.log({ old: params.toString() });

        params.set("page", e.toString());
        console.log({ afterSetPage: params.toString() });

        router.replace(`${pathname}?${params.toString()}`);
    };
    return (
        <Pagination
            showControls
            variant="light"
            total={total}
            page={currentPage}
            onChange={handleChangePagination}
            // initialPage={initialPage}
        />
    );
}
