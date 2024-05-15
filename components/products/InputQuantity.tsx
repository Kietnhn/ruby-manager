import { Input } from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";

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
    const [value, setValue] = useState(() => getValue());
    // const inputRef = useRef<HTMLInputElement | null>(null);
    const onBlur = () => {
        table.options.meta?.updateData(row.index, column.id, +value);
    };
    // useEffect(() => {
    //     if (!inputRef || !inputRef.current) return;
    //     inputRef.current.value = getValue();
    // }, [table.options.data]);
    return (
        <Input
            // ref={inputRef}
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
