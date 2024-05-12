"use client";

import InputName from "@/components/products/InputName";
import InputQuantity from "@/components/products/InputQuantity";
import { VariationNoImages } from "@/lib/definitions";
import { useAppSelector } from "@/lib/store";
import { getPublicIdFromUrl } from "@/lib/utils";
import { PhotoIcon } from "@heroicons/react/16/solid";
import { ButtonGroup, Image } from "@nextui-org/react";
import { Image as TypeImage, Variation } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<VariationNoImages>[] = [
    {
        accessorKey: "id",
        header: "No.",
        enableSorting: false,
        size: 50,
        cell: (props) => {
            return props.row.index + 1;
        },
    },
    {
        accessorKey: "images",
        header: "Images",
        size: 100,
        enableSorting: false,
        cell: (props) => {
            const { gallery } = useAppSelector((store) => store.product);
            const color = props.row.original.color;
            const currentGallary = gallery.find((item) => item.color === color);
            // const imgs = props.getValue() as string[];

            return (
                <div className="w-full flex justify-center items-center">
                    {!currentGallary || currentGallary?.images?.length <= 0 ? (
                        <div className="w-14 h-14 rounded-medium relative flex items-center justify-center bg-gray-400">
                            <PhotoIcon className="w-6 h-6" />
                        </div>
                    ) : (
                        <Image
                            className="w-14 h-14 rounded-medium object-cover"
                            src={currentGallary?.images?.at(0)}
                            alt={getPublicIdFromUrl(
                                currentGallary?.images?.at(0) as string
                            )}
                        />
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: InputName,
    },
    {
        accessorKey: "size",
        header: "Size",
        size: 100,
        cell: (props) => (
            <p className="capitalize">{props.getValue() as string}</p>
        ),
    },
    {
        accessorKey: "color",
        header: "Color",
        size: 100,
        cell: (props) => (
            <p className="capitalize">{props.getValue() as string}</p>
        ),
    },

    {
        accessorKey: "stock",
        header: "Stock",
        size: 100,
        cell: InputQuantity,
    },

    // {
    //     header: "Actions",
    //     cell: (props) => {
    //         const id = props.row.original.id;
    //         return (
    //             <ButtonGroup>
    //                 <EditProduct id={id} />
    //             </ButtonGroup>
    //         );
    //     },
    // },
];
