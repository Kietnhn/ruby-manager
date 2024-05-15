"use client";

import { setGallery } from "@/features/product-slice";
import { TGallery, VariationNoImages } from "@/lib/definitions";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { getUniqueColors } from "@/lib/utils";
import { Variation } from "@prisma/client";
import { useEffect, useState } from "react";
import CardWrapper from "../ui/card-wrapper";
import Variants from "../products/variants";
import Gallery from "../products/gallery";
import { DataTable } from "../data-table";
import { columns } from "@/app/dashboard/products/create/columns";

export default function EditForm({
    initVariations,
}: {
    initVariations: Variation[];
}) {
    const [variations, setVariations] =
        useState<VariationNoImages[]>(initVariations);
    const { gallery } = useAppSelector((store) => store.product);
    const dispatch = useAppDispatch();

    // effects
    useEffect(() => {
        console.log({ initVariations });
        console.log("product variations", variations);
        console.log("variations", variations);

        const uniqueColors = getUniqueColors(variations);
        console.log("uniqueColors", uniqueColors);

        // const initialGallery:TGallery[] = []
        const initialGallery: TGallery[] = uniqueColors.map((color) => {
            const variationMatchColor = initVariations.find(
                (variation) => variation.color === color
            );
            return {
                color: color,
                images: variationMatchColor?.images as string[],
            };
        });
        console.log("initialGallery", initialGallery);

        // innitialize for gallery
        dispatch(setGallery(initialGallery));
    }, []);
    return (
        <CardWrapper heading="Edit Variations Form">
            <div className="flex gap-4 flex-nowrap">
                <CardWrapper heading="Gallery" className="flex-1">
                    <div className="w-full flex flex-col gap-4">
                        {gallery.map((item, index) => (
                            <Gallery key={index} variationColor={item.color} />
                        ))}
                    </div>
                </CardWrapper>
                <CardWrapper heading="Variation Attributes" className="w-1/3">
                    <Variants
                        initialValue={initVariations}
                        variations={variations}
                        setVariations={setVariations}
                    />
                </CardWrapper>
            </div>
            <CardWrapper heading="Variations" className="w-full">
                <DataTable
                    columns={columns}
                    data={variations}
                    setData={setVariations}
                />
            </CardWrapper>
        </CardWrapper>
    );
}
