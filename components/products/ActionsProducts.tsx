import React from "react";
import {
    ConfirmDelete,
    DeleteButton,
    EditLinkButton,
} from "@/components/buttons";
import { TrashIcon } from "@heroicons/react/24/outline";
import {
    Button,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@nextui-org/react";
import { deleteProduct } from "@/lib/actions/product";
const ActionsProducts = ({ id, name }: { id: string; name: string }) => {
    const deleteProductWithId = deleteProduct.bind(null, id);

    return (
        <div className="flex gap-1">
            <EditLinkButton
                href={`/dashboard/products/${id}/edit`}
                content="Edit product"
            />
            <ConfirmDelete action={deleteProductWithId} name="product" />
        </div>
    );
};

export default ActionsProducts;
