"use client";

import { EditLinkButton, ViewLinkButton } from "@/components/buttons";
import { GroupedProperties } from "@/lib/definitions";
import { renderId } from "@/lib/utils";
import { Tooltip } from "@nextui-org/react";
import { Property } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<GroupedProperties>[] = [
    {
        accessorKey: "name",
        header: "Name",
        size: 80,

        cell: (props) => {
            return (
                <p className="font-semibold capitalize">
                    {props.getValue() as string}
                </p>
            );
        },
    },
    {
        accessorKey: "values",
        header: "Values",
        cell: (props) => {
            const values = props.getValue() as Property[];
            const propertyvalues = values.map((value) => value.value);
            return (
                <p className="text-foreground capitalize">
                    {propertyvalues.join(" | ")}
                </p>
            );
        },
    },
    {
        header: "Actions",
        enableSorting: false,

        cell: (props) => {
            const name = props.row.original.name;
            const editUrl = `/dashboard/products/properties/${name}`;
            return <ViewLinkButton href={editUrl} content="View property" />;
        },
    },
];
