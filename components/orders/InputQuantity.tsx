import { Input } from "@nextui-org/react";
import { Variation } from "@prisma/client";
import React, { ChangeEvent, useMemo, useState } from "react";

const InputQuantity = ({
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
    const initialValue: string = getValue();
    const [value, setValue] = useState<string>(initialValue);

    const inStock = useMemo(() => {
        const variation = row.original.variation as Variation | null;

        return variation?.stock || 0;
    }, [row]);
    const onBlur = (e: any) => {
        const quantity = +value;
        const price = row.original.price;
        table.options.meta?.updateData(row.index, column.id, quantity);
        table.options.meta?.updateData(row.index, "subTotal", price * quantity);
    };
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numberValue = +value;
        if (isNaN(numberValue)) return;
        if (numberValue > inStock) return;
        if (numberValue <= 0) {
            setValue("1");
        } else {
            setValue(value);
        }
    };
    return (
        <Input
            variant="bordered"
            type="number"
            size="sm"
            value={value}
            placeholder="0"
            min={inStock > 0 ? 1 : 0}
            max={inStock}
            errorMessage={`Value must be between 1 and ${inStock}`}
            endContent={
                <span className="text-foreground-500 text-xs">/{inStock}</span>
            }
            onBlur={onBlur}
            onChange={handleChange}
        />
    );
};

export default InputQuantity;
