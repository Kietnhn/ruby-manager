"use client";

import { Avatar, Button, Tooltip } from "@nextui-org/react";
import { ColumnDef } from "@tanstack/react-table";
import { Category, UserCustomer } from "@/lib/definitions";
import { Measurement } from "@prisma/client";
import Link from "next/link";
import { PencilIcon } from "@heroicons/react/24/outline";
import { renderId } from "@/lib/utils";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const columns: ColumnDef<Measurement>[] = [
    {
        accessorKey: "id",
        header: "Id",
        cell: (props) => {
            return (
                <Tooltip content={props.getValue() as string}>
                    <p> {renderId(props.getValue() as string)}</p>
                </Tooltip>
            );
        },
    },

    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "sizes",
        header: "Sizes",
        cell: (props) => {
            const sizes = props.getValue() as string[];

            return <p className="capitalize">{sizes.join(" | ")}</p>;
        },
    },

    {
        accessorKey: "actions",
        header: "Actions",
        enableSorting: false,
        cell: (props) => {
            const id = props.row.original.id;
            return (
                <div className="flex justify-center">
                    <Link
                        href={`/dashboard/categories/measurements/${id}/edit`}
                    >
                        <Button isIconOnly>
                            <PencilIcon className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            );
        },
    },
];
