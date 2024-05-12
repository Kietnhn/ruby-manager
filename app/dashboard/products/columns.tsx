"use client";

import ActionsProducts from "@/components/products/ActionsProducts";
import { FlatProduct } from "@/lib/definitions";
import { getPublicIdFromUrl, renderId, renderPrice } from "@/lib/utils";
import { CheckCircleIcon, NoSymbolIcon } from "@heroicons/react/24/outline";

import { Card, Image, Tooltip } from "@nextui-org/react";
import { Collection, Gallery, Property, StyleGender } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<FlatProduct>[] = [
    {
        accessorKey: "sku",
        header: "SKU",
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
                <strong className="line-clamp-3">
                    {props.getValue() as string}
                </strong>
            );
        },
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
        accessorKey: "gender",
        header: "Gender",
        filterFn: (row, columnId, filterStatuses) => {
            if (filterStatuses.length === 0) return true;
            const gender: string = row.getValue(columnId);

            return filterStatuses.includes(gender);
        },
        cell: (props) => {
            const gender = props.getValue() as StyleGender;
            return (
                <Tooltip content={gender}>
                    <p>{gender[0]}</p>
                </Tooltip>
            );
        },
    },

    {
        accessorKey: "price",
        header: "Price",
        cell: (props) => {
            const salePrice = props.row.original.salePrice;
            const priceCurrency = props.row.original.priceCurrency;
            const price = props.getValue() as number;
            return (
                <>
                    {salePrice ? (
                        <Tooltip
                            content={
                                <p className=" ">
                                    Original
                                    <strong className="ml-0.5">
                                        {renderPrice(price, priceCurrency)}
                                    </strong>
                                </p>
                            }
                        >
                            <strong className="text-yellow-500">
                                {renderPrice(salePrice, priceCurrency)}
                            </strong>
                        </Tooltip>
                    ) : (
                        <strong className=" ">
                            {renderPrice(price, priceCurrency)}
                        </strong>
                    )}
                </>
            );
        },
    },
    // {
    //     accessorKey: "isAvailable",
    //     header: "Availability",
    //     cell: (props) => {
    //         const isAvailable = props.getValue() as boolean;
    //         return (
    //             <div className="flex justify-center items-center">
    //                 {isAvailable ? (
    //                     <CheckCircleIcon className="w-5 h-5 text-success-500" />
    //                 ) : (
    //                     <NoSymbolIcon className="w-5 h-5 text-danger-500" />
    //                 )}
    //             </div>
    //         );
    //     },
    // },
    {
        accessorKey: "brand",
        header: "Brand",
        filterFn: (row, columnId, filterStatuses) => {
            if (filterStatuses.length === 0) return true;
            const brand: string = row.getValue(columnId);

            return filterStatuses.includes(brand);
        },
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
            const categoryCode = props.row.original.categoryCode;
            return (
                <Tooltip content={props.getValue() as string}>
                    <p className="capitalize">{categoryCode}</p>
                </Tooltip>
            );
        },
    },

    {
        accessorKey: "collections",
        header: "Collections",
        filterFn: (row, columnId, filterStatuses) => {
            if (filterStatuses.length === 0) return true;
            const collections: string[] = row.getValue(columnId);

            return !!collections.find((coll) => filterStatuses.includes(coll));
        },
        cell: (props) => {
            const collections = props.getValue() as string[];
            const collectionCodes = props.row.original.collectionCodes;
            return (
                <div className="flex justify-center gap-2">
                    {collections.map((name, index) => (
                        <Tooltip content={name} key={index}>
                            <p className="capitalize">
                                {collectionCodes[index]}
                                {index === collectionCodes.length - 1
                                    ? ""
                                    : ","}
                            </p>
                        </Tooltip>
                    ))}
                </div>
            );
        },
    },
    {
        accessorKey: "properties",
        header: "Properties",
        cell: (props) => {
            const properties = props.getValue() as Property[];
            const values = properties.map((property) => property.value);
            return (
                <p className="pointer-events-none line-clamp-3 capitalize">
                    {values.join(", ")}
                </p>
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
    {
        header: "Actions",
        enableSorting: false,

        cell: (props) => {
            const id = props.row.original.id;
            const name = props.row.original.name;
            return <ActionsProducts id={id} name={name} />;
        },
    },
];
