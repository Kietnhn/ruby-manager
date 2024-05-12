"use client";

import ActionsProducts from "@/components/products/ActionsProducts";
import { FlatProduct } from "@/lib/definitions";
import { getPublicIdFromUrl, renderId } from "@/lib/utils";
import { CheckCircleIcon, NoSymbolIcon } from "@heroicons/react/24/outline";

import { Card, Checkbox, Image, Tooltip } from "@nextui-org/react";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<FlatProduct>[] = [
    {
        id: "select-col",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllRowsSelected()}
                // indeterminate={table.getIsSomeRowsSelected()}
                onChange={table.getToggleAllRowsSelectedHandler()} //or getToggleAllPageRowsSelectedHandler
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                disabled={!row.getCanSelect()}
                onChange={row.getToggleSelectedHandler()}
                isSelected={row.getIsSelected()}
            />
        ),
    },
    {
        accessorKey: "sku",
        header: "SKU",
        size: 80,
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
        size: 120,
        enableSorting: false,

        cell: (props) => {
            const imgs = props.getValue() as string[];

            return (
                <div className="flex justify-center items-center">
                    {imgs.length > 0 ? (
                        <Card className="w-14 h-14 rounded-medium object-cover">
                            <Image
                                className="w-full h-full rounded-medium object-cover"
                                src={imgs[0]}
                                alt={getPublicIdFromUrl(imgs[0])}
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
    },
    {
        accessorKey: "description",
        header: "Description",
        enableSorting: false,
        cell: (props) => {
            const description = props.getValue() as string;
            <div />;
            return (
                <div
                    className="line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: description }}
                />
            );
        },
    },
    {
        accessorKey: "fit",
        header: "Fit",
    },
    {
        accessorKey: "material",
        header: "Material",
    },
    {
        accessorKey: "style",
        header: "Style",
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: (props) => {
            return (
                <p className="text-gray-500 pointer-events-none">
                    ${props.getValue() as number}
                </p>
            );
        },
    },
    {
        accessorKey: "isAvailable",
        header: "Availability",
        cell: (props) => {
            const isAvailable = props.getValue() as boolean;
            return (
                <div className="flex justify-center items-center">
                    {isAvailable ? (
                        <CheckCircleIcon className="w-5 h-5 text-success-500" />
                    ) : (
                        <NoSymbolIcon className="w-5 h-5 text-danger-500" />
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "brand",
        header: "Brand",
        cell: (props) => {
            const brandCode = props.row.original.brandCode;
            return (
                <Tooltip content={props.getValue() as string}>
                    <p className="capitalize">{brandCode}</p>
                </Tooltip>
            );
        },
    },
    {
        accessorKey: "category",
        header: "Category",
        filterFn: (row, columnId, filterStatuses) => {
            if (filterStatuses.length === 0) return true;
            const category: string = row.getValue(columnId);
            return filterStatuses.includes(category);
        },
        cell: (props) => {
            return <p className="capitalize">{props.getValue() as string}</p>;
        },
    },

    {
        accessorKey: "collections",
        header: "Collections",
        cell: (props) => {
            const collections = props.getValue() as string[];
            const collectionCodes = props.row.original.collectionCodes;
            return (
                <>
                    {collections.map((name, index) => (
                        <Tooltip content={name} key={index}>
                            <p className="capitalize">
                                {collectionCodes[index]}
                            </p>
                        </Tooltip>
                    ))}
                </>
            );
        },
    },
    {
        accessorKey: "variationsLength",
        header: "Variations",
        cell: (props) => {
            return (
                <p className="text-gray-500 pointer-events-none">
                    ({props.getValue() as number})
                </p>
            );
        },
    },
];
