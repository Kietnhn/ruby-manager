"use client";

import ButtonRemove from "@/components/orders/ButtonRemove";
import InputQuantity from "@/components/orders/InputQuantity";
import SelectColor from "@/components/orders/SelectColor";
import SelectSize from "@/components/orders/SelectSize";
import { FullOrderProduct, FullProduct } from "@/lib/definitions";
import { getPublicIdFromUrl, renderPrice } from "@/lib/utils";
import { PhotoIcon } from "@heroicons/react/16/solid";
import { Card, Image } from "@nextui-org/react";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<FullOrderProduct>[] = [
    {
        accessorKey: "id",
        header: "Name",
        cell: (props) => {
            const product = props.row.original.product as FullProduct;
            return <strong>{product.name}</strong>;
        },
    },

    {
        accessorKey: "image",
        header: "Image",
        enableSorting: false,
        size: 100,
        cell: (props) => {
            const variation = props.row.original.variation;
            const imgs = variation?.images as string[];
            return (
                <Card
                    className="w-full flex justify-center items-center"
                    shadow="none"
                >
                    {!imgs || imgs.length <= 0 ? (
                        <div className="w-14 h-14 rounded-medium relative flex items-center justify-center bg-gray-400">
                            <PhotoIcon className="w-6 h-6" />
                        </div>
                    ) : (
                        <Image
                            className="w-14 h-14 rounded-medium object-cover"
                            src={imgs[0]}
                            alt={getPublicIdFromUrl(imgs[0])}
                        />
                    )}
                </Card>
            );
        },
    },
    {
        accessorKey: "color",
        header: "Color",
        enableSorting: false,
        // cell: SelectColor,
        cell: (props) => {
            const variation = props.row.original.variation;
            return <p>{variation?.color}</p>;
        },
    },
    {
        accessorKey: "size",
        header: "Size",
        enableSorting: false,
        cell: SelectSize,
    },
    {
        accessorKey: "quantity",
        header: "Quantity",
        enableSorting: false,
        cell: InputQuantity,
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: (props) => {
            const price = props.getValue() as number;
            const priceCurrency = props.row.original.priceCurrency;
            return <strong>{renderPrice(price, priceCurrency)}</strong>;
        },
    },
    {
        accessorKey: "subTotal",
        header: "Subtotal",
        cell: (props) => {
            const subTotal = props.getValue() as number;
            const priceCurrency = props.row.original.priceCurrency;
            return <strong>{renderPrice(subTotal, priceCurrency)}</strong>;
        },
    },
    {
        accessorKey: "product",
        header: "Actions",
        cell: ButtonRemove,
    },
];
