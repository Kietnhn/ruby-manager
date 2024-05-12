import {
    FullOrderProduct,
    FullProduct,
    ProductVariation,
} from "@/lib/definitions";
import { getAvailableVariations, getUniqueSizes } from "@/lib/utils";
import { Input, Select, SelectItem, Selection } from "@nextui-org/react";
import React, { useEffect, useMemo, useState } from "react";

const SelectSize = ({
    getValue,
    row,
    column,
    table,
}: {
    getValue: any;
    row: any;
    column: any;
    table: any;
}) => {
    const initialValue = row.original.product as ProductVariation;

    const [availableSizes, setAvailableSizes] = useState(() => {
        const availableVariations = getAvailableVariations(
            initialValue.variations
        );
        const uniqueSizes = getUniqueSizes(availableVariations);
        return uniqueSizes;
    });
    const [selected, setSelected] = useState<string[] | undefined>(() => {
        if (!availableSizes[0]) {
            return ["No size"];
        }
        const defaultKey = row.original.variation.size as string;
        console.log({ defaultKey });

        if (!defaultKey) return undefined;
        return [defaultKey];
    });
    // const defaultKeys = () => {
    //     if (!availableSizes[0]) {
    //         return ["No size"];
    //     }
    //     const defaultKey = row.original.variation.size as string;
    //     console.log({ defaultKey });

    //     if (!defaultKey) return undefined;
    //     return [defaultKey];
    // };
    // const [currentVariation,setCurrentVariation] = useState<Variation>(()=>{
    //     const selectedSize = value.find(
    //         (size) => !disableKeys().includes(size)
    //     );
    //     const currentColor = initialValue.variations[0].color;
    //     const matchedVariation = initialValue.variations.find(
    //         (v) => v.size === selectedSize && v.color === currentColor
    //     );
    //     return matchedVariation as Variation
    // })

    const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const size = e.target.value;
        if (!size) {
            return;
        }
        setSelected([size]);
        const currentColor = row.original.variation.color;
        const matchedVariation = initialValue.variations.find(
            (v) => v.size === size && v.color === currentColor
        );
        if (!matchedVariation) return;
        console.log(matchedVariation);
        table.options.meta?.updateData(
            row.index,
            "variation",
            matchedVariation
        );

        // const removedMatchedVariation = initialValue.variations.filter(
        //     (v) => v.id !== matchedVariation?.id
        // );
        // const newVariations = [matchedVariation, ...removedMatchedVariation];
    };

    // const disableKeys = () => {
    //     const selectedProducts = table.options.data as FullOrderProduct[];
    //     const existedProducts = selectedProducts.filter(
    //         (selectedProducts) =>
    //             selectedProducts.product.id === row.original.product.id
    //     );
    //     console.log({ existedProducts });

    //     if (existedProducts.length > 1) {
    //         const selectedSizes = existedProducts.map(
    //             (item) => item.variation.size
    //         );
    //         console.log({ selectedSizes });

    //         return selectedSizes;
    //     }
    //     return [];
    // };

    // useEffect(() => {
    //     const selectedKey = value.find((size) => !disableKeys().includes(size));
    //     // if first value is existedd , update to new value with same color
    //     if (selectedKey) {
    //         const currentColor = row.original.variation.color;

    //         const newVariation = initialValue.variations.find(
    //             (v) => v.size !== selectedKey && v.color === currentColor
    //         );

    //         table.options.meta?.updateData(
    //             row.index,
    //             "variation",
    //             newVariation
    //         );
    //     }
    // }, []);

    return (
        <Select
            aria-label="Select size at order product"
            onChange={handleSelectionChange}
            variant="bordered"
            size="sm"
            // disabledKeys={disableKeys()}
            errorMessage="Please select size at order"
            selectedKeys={selected}
            selectionMode="single"
            isDisabled={availableSizes.length <= 1 && !availableSizes[0]}
        >
            {availableSizes.length <= 1 && !availableSizes[0] ? (
                <SelectItem key={"No size"} value={"No size"}>
                    No size
                </SelectItem>
            ) : (
                availableSizes.map((size) => (
                    <SelectItem key={size} value={size}>
                        {size}
                    </SelectItem>
                ))
            )}
        </Select>
    );
};

export default SelectSize;
