import { FullProduct } from "@/lib/definitions";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Button, Input, Select, SelectItem, Tooltip } from "@nextui-org/react";
import React, { useState } from "react";

const ButtonRemove = ({
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
    const onClick = () => {
        table.options.meta?.removeItem(row.index);
    };
    return (
        <Tooltip content="Remove">
            <Button isIconOnly onClick={onClick} color="danger">
                <TrashIcon className="w-5 h-5" />
            </Button>
        </Tooltip>
    );
};

export default ButtonRemove;
