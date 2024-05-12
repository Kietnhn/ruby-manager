import { Input } from "@nextui-org/react";
import { Variation } from "@prisma/client";
import React, { useMemo, useState } from "react";

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
    const [value, setValue] = useState(initialValue);

    const inStock = useMemo(() => {
        const variation = row.original.variation as Variation | null;

        return variation?.stock || 0;
    }, [row]);
    const onBlur = (e: any) => {
        const quantity = +value;
        // if (quantity > inStock) {
        //     return e.target?.focus();
        // }
        const price = row.original.price;

        table.options.meta?.updateData(row.index, column.id, quantity);
        table.options.meta?.updateData(row.index, "subTotal", price * quantity);
    };
    return (
        <Input
            variant="bordered"
            type="number"
            size="sm"
            defaultValue={value}
            placeholder="1"
            min={inStock > 0 ? 1 : 0}
            max={inStock}
            errorMessage={`Value must be between 1 and ${inStock}`}
            endContent={
                <span className="text-default-500 text-sm">/{inStock}</span>
            }
            onBlur={onBlur}
            onChange={(e) => setValue(e.target.value)}
        />
    );
};

export default InputQuantity;
