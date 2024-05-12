import { Input } from "@nextui-org/react";
import React, { useState } from "react";

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
    const onBlur = () => {
        table.options.meta?.updateData(row.index, column.id, +value);
    };
    return (
        <Input
            variant="bordered"
            type="number"
            size="sm"
            value={value}
            placeholder="0"
            min={0}
            onBlur={onBlur}
            onChange={(e) => setValue(e.target.value)}
        />
    );
};

export default InputQuantity;
