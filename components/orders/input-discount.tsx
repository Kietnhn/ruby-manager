"use client";

import { Button, Input, Tooltip } from "@nextui-org/react";
import { SendIcon } from "lucide-react";

export default function InputDiscount() {
    return (
        <Input
            label="Discount"
            placeholder="Enter discount code"
            variant="bordered"
            endContent={
                <Tooltip content="Apply">
                    <Button isIconOnly>
                        <SendIcon className="w-5 h-5" />
                    </Button>
                </Tooltip>
            }
        />
    );
}
