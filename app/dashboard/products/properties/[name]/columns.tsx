"use client";

import {
    ConfirmDelete,
    DeleteButton,
    EditLinkButton,
} from "@/components/buttons";
import { deleteProperty } from "@/lib/actions/product";
import { renderId } from "@/lib/utils";
import { Tooltip } from "@nextui-org/react";
import { Property } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Property>[] = [
    {
        accessorKey: "id",
        header: "Id",
        size: 80,
        cell: (props) => (
            <Tooltip content={props.getValue() as string}>
                <p> {renderId(props.getValue() as string)}</p>
            </Tooltip>
        ),
    },
    {
        accessorKey: "value",
        header: "Value",
    },
    {
        header: "Actions",
        enableSorting: false,

        cell: (props) => {
            const id = props.row.original.id;
            const name = props.row.original.name;
            const editUrl = `/dashboard/products/properties/${name}/${id}/edit`;
            const deletePropertyWithId = deleteProperty.bind(null, id);
            return (
                <div className="flex-center gap-2">
                    <EditLinkButton href={editUrl} content="Edit property" />
                    <ConfirmDelete
                        deleteComponent={
                            <DeleteButton action={deletePropertyWithId} />
                        }
                        name="property"
                    />
                </div>
            );
        },
    },
];
