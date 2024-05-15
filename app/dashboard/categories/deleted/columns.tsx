"use client";

import { getPublicIdFromUrl, renderId } from "@/lib/utils";
import { Avatar, Button, Tooltip } from "@nextui-org/react";
import { ColumnDef } from "@tanstack/react-table";
import { ICategory, UserCustomer } from "@/lib/definitions";
import { Address, Measurement, Order, UserKind } from "@prisma/client";
import clsx from "clsx";
import Link from "next/link";
import { EyeIcon, PencilIcon } from "@heroicons/react/24/outline";
import { DeepDeleteButton, RestoreButton } from "@/components/buttons";
import { deepDeleteCategory, restoreCategory } from "@/lib/actions/category";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const columns: ColumnDef<ICategory>[] = [
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
            const parent = props.getValue() as ICategory;

            return <p>{parent?.name ? parent.name : "null"}</p>;
        },
    },
    {
        accessorKey: "measurement",
        header: "Measurement",
        cell: (props) => {
            const measurement = props.getValue() as Measurement;

            return (
                <Tooltip content={measurement.sizes.join("|")}>
                    <p className="capitalize">{measurement.name}</p>
                </Tooltip>
            );
        },
    },

    {
        accessorKey: "actions",
        header: "Actions",
        enableSorting: false,
        cell: (props) => {
            const id = props.row.original.id;
            const deepDeleteCategoryWithId = deepDeleteCategory.bind(null, id);
            const restoreCategoryWithId = restoreCategory.bind(null, id);
            return (
                <div className="flex justify-center gap-2">
                    <RestoreButton action={restoreCategoryWithId} />
                    <DeepDeleteButton action={deepDeleteCategoryWithId} />
                </div>
            );
        },
    },
];
