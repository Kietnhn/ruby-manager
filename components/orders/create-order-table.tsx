"use client";

import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/table";
import clsx from "clsx";

import { FullOrderProduct, TypeFilter } from "@/lib/definitions";
import { columns } from "@/app/dashboard/orders/create/columns";

import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import AutocomleteProducts from "./autocomlete-products";

const CreateOrderTable = ({
    data,
    setData,
}: {
    data: FullOrderProduct[];
    setData: React.Dispatch<React.SetStateAction<FullOrderProduct[]>>;
}) => {
    const [columnFilters, setColumnFilters] = useState<TypeFilter[]>([]);
    const table = useReactTable({
        data,
        columns,
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: { columnFilters },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        meta: {
            updateData:
                typeof setData === "function"
                    ? (rowIndex: number, columnId: string, value: string) =>
                          setData((prev) =>
                              prev.map((row, index) =>
                                  index === rowIndex
                                      ? {
                                            ...prev[rowIndex],
                                            [columnId]: value,
                                        }
                                      : row
                              )
                          )
                    : () => {},
            removeItem:
                typeof setData === "function"
                    ? (rowIndex: number, columnId: string) => {
                          setData((prev) =>
                              prev.filter((row, index) => index !== rowIndex)
                          );
                      }
                    : () => {},
        },
    });

    return (
        <div>
            <AutocomleteProducts data={data} setData={setData} />

            <div className="border-medium rounded-medium mb-4">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className="text-center group"
                                            style={{
                                                width: `${header.getSize()}px`,
                                            }}
                                        >
                                            <div
                                                className={clsx(
                                                    `flex justify-center items-center `,
                                                    {
                                                        "hover:cursor-pointer":
                                                            header.column.getCanSort(),
                                                    }
                                                )}
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext()
                                                      )}

                                                {
                                                    {
                                                        asc: " 🔼",
                                                        desc: " 🔽",
                                                    }[
                                                        header.column.getIsSorted() as
                                                            | "asc"
                                                            | "desc"
                                                    ]
                                                }
                                            </div>
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="text-center "
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default CreateOrderTable;
