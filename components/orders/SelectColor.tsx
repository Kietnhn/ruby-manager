import { FullProduct } from "@/lib/definitions";
import { Select, SelectItem, Selection } from "@nextui-org/react";
import { Variation } from "@prisma/client";
import React, { useState } from "react";

const SelectColor = ({
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
    const initialValue = row.original.product as FullProduct;
    const [value, setValue] = useState(() => {
        const setColors = new Set(initialValue.variations.map((v) => v.color));
        return Array.from(setColors);
    });

    const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const color = e.target.value;
        const currentSize = initialValue.variations[0].size;
        const matchedVariation = initialValue.variations.find(
            (v) => v.color === color && v.size === currentSize
        );

        const removedMatchedVariation = initialValue.variations.filter(
            (v) => v.id !== matchedVariation?.id
        );

        const newVariations = [matchedVariation, ...removedMatchedVariation];

        table.options.meta?.updateData(row.index, "product", {
            ...initialValue,
            variations: newVariations,
        });
    };
    return (
        <Select
            aria-label="Select size at order product"
            onChange={handleSelectionChange}
            variant="bordered"
            size="sm"
            defaultSelectedKeys={[value.length === 0 ? "No size" : value[0]]}
            isDisabled={value.length <= 1}
        >
            {value.map((color) => (
                <SelectItem key={color} value={color}>
                    {color}
                </SelectItem>
            ))}
        </Select>
    );
};

export default SelectColor;
