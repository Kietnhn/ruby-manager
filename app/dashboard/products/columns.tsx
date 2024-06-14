"use client";

import ActionsProducts from "@/components/products/ActionsProducts";
import { FlatProduct } from "@/lib/definitions";
import { getPublicIdFromUrl, renderId, renderPrice } from "@/lib/utils";
import { CheckCircleIcon, NoSymbolIcon } from "@heroicons/react/24/outline";

import {
    Avatar,
    AvatarGroup,
    Card,
    Image,
    Tooltip,
    image,
} from "@nextui-org/react";
import { Collection, Gallery, Property, StyleGender } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import NoImage from "@/public/no-image.jpg";
import { EditLinkButton } from "@/components/buttons";
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
            const galleries = props.getValue() as Gallery[];

            return (
                <div className="flex justify-center items-center">
                    {galleries.length > 0 ? (
                        <AvatarGroup max={3} isBordered>
                            {galleries.map((gallery, index) => (
                                <Avatar
                                    key={index}
                                    showFallback
                                    name={gallery.color}
                                    src={gallery.images[0]}
                                    radius="sm"
                                    alt={getPublicIdFromUrl(gallery.images[0])}
                                    size="lg"
                                />
                            ))}
                        </AvatarGroup>
                    ) : (
                        <Avatar
                            size="lg"
                            src={NoImage.src}
                            alt={"No Image"}
                            radius="sm"
                            isBordered
                        />
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "name",
        header: "Name",
        // enableColumnFilter: true,
        enableSorting: false,

        // filterFn: "includesString",
        cell: (props) => {
            return (
                <strong className="line-clamp-3">
                    {props.getValue() as string}
                </strong>
            );
        },
    },
    // {
    //     accessorKey: "description",
    //     header: "Description",
    //     enableSorting: false,
    //     cell: (props) => {
    //         const description = props.getValue() as string;
    //         <div />;
    //         return (
    //             <div
    //                 className="line-clamp-3"
    //                 dangerouslySetInnerHTML={{ __html: description }}
    //             />
    //         );
    //     },
    // },
    {
        accessorKey: "gender",
        header: "Gender",
        enableSorting: false,

        // filterFn: (row, columnId, filterStatuses) => {
        //     if (filterStatuses.length === 0) return true;
        //     const gender: string = row.getValue(columnId);

        //     return filterStatuses.includes(gender);
        // },
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
        accessorKey: "category",
        header: "Category",
        enableSorting: false,

        // filterFn: (row, columnId, filterStatuses) => {
        //     if (filterStatuses.length === 0) return true;
        //     const category: string = row.getValue(columnId);
        //     return filterStatuses.includes(category);
        // },
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
        accessorKey: "brand",
        header: "Brand",
        enableSorting: false,

        // filterFn: (row, columnId, filterStatuses) => {
        //     if (filterStatuses.length === 0) return true;
        //     const brand: string = row.getValue(columnId);

        //     return filterStatuses.includes(brand);
        // },
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
        accessorKey: "properties",
        header: "Properties",
        enableSorting: false,

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
    // {
    //     accessorKey: "variationsLength",
    //     header: "Variations",
    //     enableSorting: false,

    //     cell: (props) => {
    //         return (
    //             <p className="text-foreground-500 pointer-events-none">
    //                 ({props.getValue() as number})
    //             </p>
    //         );
    //     },
    // },
    {
        accessorKey: "releaseAt",
        header: "Release at",
        enableSorting: false,

        cell: (props) => {
            const releaseAt = props.getValue() as Date;
            return (
                <p className="" suppressHydrationWarning>
                    {releaseAt?.toLocaleDateString() || "null"}
                </p>
            );
        },
    },
    {
        header: "Action",
        enableSorting: false,

        cell: (props) => {
            const id = props.row.original.id;
            // const name = props.row.original.name;
            // return <ActionsProducts id={id} name={name} />;
            return (
                <EditLinkButton
                    href={`/dashboard/products/${id}/edit`}
                    content="Edit product"
                />
            );
        },
    },
];
