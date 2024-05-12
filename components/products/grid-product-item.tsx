"use client";
import { FullProduct } from "@/lib/definitions";
import {
    getPublicIdFromUrl,
    getUniqueColors,
    getVariationHaveImages,
    groupAvailableVariations,
} from "@/lib/utils";
import { PlusIcon } from "@heroicons/react/24/outline";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Image,
    Radio,
    RadioGroup,
} from "@nextui-org/react";
import { Variation } from "@prisma/client";
import React, { useState } from "react";
type Select<T extends keyof Variation = keyof Variation> = {
    id: number;
    option: string;
    values: Variation[T][];
};
const GridProductItem = ({ product }: { product: FullProduct }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const variationHaveImages = getVariationHaveImages(product.variations);
    const [groupedVaiations, setGroupedVaiations] = useState<Select[]>(
        groupAvailableVariations(product.variations).filter(
            (item) => item.option !== "color"
        )
    );
    const colorsVaiations = getUniqueColors(product.variations);
    const [variationByColor, setVariationByColor] = useState<Variation[]>(
        product.variations.filter(
            (variation) => variation.color === colorsVaiations[0]
        )
    );
    // variationByColor[0][groupedVaiations[0].option]=
    return (
        <>
            <Card shadow="sm" isPressable onPress={() => setIsOpen(!isOpen)}>
                <CardBody className="overflow-visible p-0 h-full">
                    <Image
                        width="100%"
                        alt={getPublicIdFromUrl(
                            variationHaveImages?.images[0] as string
                        )}
                        className="w-full object-cover h-full"
                        src={variationHaveImages?.images[0] as string}
                    />
                </CardBody>
                <CardFooter className="text-small justify-between">
                    <b>{product.name}</b>
                    <p className="text-default-500">${product.price}</p>
                </CardFooter>
            </Card>
            {isOpen && (
                <Card>
                    <CardHeader>
                        <b>{product.name}</b>
                    </CardHeader>
                    <CardBody>
                        <b>Variations</b>
                        {/* {colorsVaiations.map((item, index) => (
                            <div key={index}>
                                <RadioGroup
                                    label={item.option}
                                    orientation="horizontal"
                                    defaultValue={
                                        item.values.length === 1
                                            ? item.values[0]
                                            : ""
                                    }
                                >
                                    {item.values.map((value, index) => (
                                        <Radio
                                            key={index}
                                            value={value}
                                            classNames={{ base: "capitalize" }}
                                        >
                                            {value}
                                        </Radio>
                                    ))}
                                </RadioGroup>
                            </div>
                        ))} */}
                        <RadioGroup label={"Size"} orientation="horizontal">
                            {variationByColor.map((variation, index) => {
                                return (
                                    <Radio
                                        key={index}
                                        value={variation.size as string}
                                        classNames={{ base: "capitalize" }}
                                    >
                                        {variation.size as string}
                                    </Radio>
                                );
                            })}
                        </RadioGroup>
                        <RadioGroup label={"Color"} orientation="horizontal">
                            {colorsVaiations.map((color, index) => (
                                <Radio
                                    key={index}
                                    value={color}
                                    classNames={{ base: "capitalize" }}
                                >
                                    {color}
                                </Radio>
                            ))}
                        </RadioGroup>
                    </CardBody>
                    <CardFooter>
                        <Button color="primary" type="button">
                            <PlusIcon className="w-5 h-5" />
                            Add to cart
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </>
    );
};

export default GridProductItem;
