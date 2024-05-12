"use client";

import { ViewLinkButton } from "@/components/buttons";
import { ITopSelling } from "@/lib/definitions";
import { getPublicIdFromUrl, renderId } from "@/lib/utils";
import { Card, Image, Tooltip } from "@nextui-org/react";
import { Gallery } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<ITopSelling>[] = [
    {
        accessorKey: "sku",
        header: "SKU",
        size: 50,
        enableSorting: false,
        cell: (props) => (
            <Tooltip content={props.getValue() as string}>
                <p> {renderId(props.getValue() as string)}</p>
            </Tooltip>
        ),
    },
    {
        accessorKey: "gallery",
        header: "Gallery",
        enableSorting: false,
        size: 60,
        cell: (props) => {
            const imgs = props.getValue() as Gallery[];

            return (
                <div className="flex justify-center items-center">
                    {imgs.length > 0 ? (
                        <Card className="w-14 h-14 rounded-medium object-cover">
                            <Image
                                className="w-full h-full rounded-medium object-cover"
                                src={imgs[0].image}
                                alt={getPublicIdFromUrl(imgs[0].image)}
                            />
                        </Card>
                    ) : (
                        <Card className="w-14 h-14 rounded-medium object-cover" />
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "name",
        header: "Name",
        enableColumnFilter: true,
        filterFn: "includesString",
        cell: (props) => {
            return (
                <p className="line-clamp-3 font-semibold">
                    {props.getValue() as string}
                </p>
            );
        },
    },

    {
        accessorKey: "category",
        header: "Category",
        // filterFn: (row, columnId, filterStatuses) => {
        //     if (filterStatuses.length === 0) return true;
        //     const category: string = row.getValue(columnId);
        //     return filterStatuses.includes(category);
        // },
        cell: (props) => {
            const category = props.getValue() as any;
            return <p className="capitalize ">{category?.name as string}</p>;
        },
    },

    {
        accessorKey: "quantity",
        header: "Total sales",
    },
    {
        accessorKey: "id",
        header: "Action",
        cell: (props) => {
            const productId = props.getValue() as string;
            return (
                <ViewLinkButton
                    content="View"
                    href={`/dashboard/products/${productId}/edit`}
                    size="sm"
                />
            );
        },
    },
];
