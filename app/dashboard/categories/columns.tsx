"use client";

import { Button, Tooltip } from "@nextui-org/react";
import { ColumnDef } from "@tanstack/react-table";
import { ICategory } from "@/lib/definitions";
import { Measurement } from "@prisma/client";
import Link from "next/link";
import { PencilIcon } from "@heroicons/react/24/outline";
import { EditLinkButton } from "@/components/buttons";
import { renderId } from "@/lib/utils";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const columns: ColumnDef<ICategory>[] = [
    {
        accessorKey: "id",
        header: "Id",
        size: 80,
        enableSorting: false,
        cell: (props) => (
            <Tooltip content={props.getValue() as string}>
                <p> {renderId(props.getValue() as string)}</p>
            </Tooltip>
        ),
    },
    {
        accessorKey: "code",
        header: "Code",
    },

    {
        accessorKey: "name",
        header: "Name",
    },

    {
        accessorKey: "parent",
        header: "Parent",
        cell: (props) => {
            const parent = props.getValue() as ICategory | null;
            return <p>{parent?.name ? parent.name : "No parent"}</p>;
        },
    },
    {
        accessorKey: "measurement",
        header: "Measurement",
        cell: (props) => {
            const measurement = props.getValue() as Measurement;

            return (
                <Tooltip content={measurement?.sizes?.join("|")}>
                    <p className="capitalize">{measurement?.name}</p>
                </Tooltip>
            );
        },
    },
    // {
    //     accessorKey: "size",
    //     header: "Sizes",
    //     cell: (props) => {
    //         const measurement = props.row.original
    //             .measurement as Measurement | null;

    //         return <div>{measurement?.sizes.join("|")}</div>;
    //     },
    // },

    {
        accessorKey: "createdAt",
        header: "Created at",
        cell: (props) => {
            const createdAt = props.getValue() as Date;
            return (
                <p className="" suppressHydrationWarning>
                    {createdAt?.toLocaleDateString()}
                </p>
            );
        },
    },
    {
        accessorKey: "actions",
        header: "Actions",
        enableSorting: false,
        cell: (props) => {
            const id = props.row.original.id;
            return (
                <EditLinkButton href={`/dashboard/categories/${id}/edit`} />
                // <div className="flex justify-center">
                //     <Link href={`/dashboard/categories/${id}/edit`}>
                //         <Button isIconOnly color="warning">
                //             <PencilIcon className="w-5 h-5" />
                //         </Button>
                //     </Link>
                // </div>
            );
        },
    },
];
