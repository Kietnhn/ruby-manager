import { Input } from "@nextui-org/react";
import React, { useState } from "react";

const InputName = ({
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
        table.options.meta?.updateData(row.index, column.id, value);
    };

    return (
        <Input
            variant="bordered"
            size="sm"
            value={value}
            placeholder="Enter name..."
            onBlur={onBlur}
            onChange={(e) => setValue(e.target.value)}
        />
    );
};

export default InputName;
