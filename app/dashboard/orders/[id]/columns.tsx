"use client";

import { FullProduct, orderProductsVariation } from "@/lib/definitions";
import { getPublicIdFromUrl } from "@/lib/utils";
import { PhotoIcon } from "@heroicons/react/16/solid";
import { Card, Image } from "@nextui-org/react";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<orderProductsVariation>[] = [
    {
        accessorKey: "product",
        header: "Product",
        cell: (props) => {
            const variation = props.row.original.variation;
            const product = variation.product;

            const imgs = variation?.images;
            return (
                <div className="flex items-center gap-2">
                    <div className="w-1/2">
                        <Card shadow="none" radius="sm">
                            {imgs?.length <= 0 ? (
                                <div className="w-16 h-w-16 rounded-sm relative flex items-center justify-center bg-gray-400">
                                    <PhotoIcon className="w-6 h-6" />
                                </div>
                            ) : (
                                <Image
                                    className="w-16 h-w-16 rounded-sm object-cover"
                                    src={imgs[0]}
                                    alt={getPublicIdFromUrl(imgs[0])}
                                />
                            )}
                        </Card>
                    </div>
                    <div className="w-1/2">
                        <div className="flex flex-col">
                            <div className="flex">
                                <strong className="text-start">
                                    {product.name}
                                </strong>
                            </div>
                            <div className="flex gap-2">
                                <small>Gender:</small>
                                <p className="font-semibold text-gray-500 capitalize">
                                    {product.gender?.toLocaleLowerCase()}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <small>Color:</small>
                                <p className="font-semibold text-gray-500">
                                    {variation.color}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <small>Size:</small>
                                <p className="font-semibold text-gray-500">
                                    {variation.size}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        },
    },

    {
        accessorKey: "price",
        header: "Price",
        cell: (props) => {
            const price = props.getValue() as number;
            return <p className="font-semibold">${price}</p>;
        },
    },
    {
        accessorKey: "quantity",
        header: "Quantity",
        cell: (props) => {
            const quantity = props.getValue() as number;
            return <p className="font-semibold">{quantity}</p>;
        },
    },

    {
        accessorKey: "subTotal",
        header: "Subtotal",
        cell: (props) => {
            const subTotal = props.getValue() as number;
            return <p className="font-semibold">${subTotal}</p>;
        },
    },
];
