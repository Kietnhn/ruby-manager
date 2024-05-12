import { TypeFilter } from "@/lib/definitions";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Input } from "@nextui-org/react";
import React, { Dispatch, SetStateAction, Suspense } from "react";
import { FilterPopover } from "./FilterPopover";

const InputFilter = ({
    columnFilters,
    setColumnFilters,
    searchId,
    filterId,
}: {
    columnFilters: TypeFilter[];
    setColumnFilters: Dispatch<SetStateAction<TypeFilter[]>>;
    searchId: string;
    filterId?: string;
}) => {
    const taskName = columnFilters.find((f) => f.id === searchId)?.value || "";

    const onFilterChange = (id: string, value: string) =>
        setColumnFilters((prev) =>
            prev
                .filter((f) => f.id !== id)
                .concat({
                    id,
                    value,
                })
        );

    return (
        <div className="flex gap-4 items-end">
            <Input
                className="max-w-[16rem]"
                variant="bordered"
                color="primary"
                // labelPlacement="outside"
                // label="Filter"
                placeholder="Task me"
                startContent={<MagnifyingGlassIcon className="w-6 h-6 " />}
                value={taskName as string}
                size="md"
                onChange={(e) => onFilterChange(searchId, e.target.value)}
            />
            <Suspense fallback={<>loading..</>}>
                {filterId === "category" ? (
                    <FilterPopover
                        columnFilters={columnFilters}
                        setColumnFilters={setColumnFilters}
                    />
                ) : (
                    <></>
                )}
            </Suspense>
        </div>
    );
};

export default InputFilter;
