// ...

import { deleteProduct } from "@/lib/actions/product";
import { Button } from "@nextui-org/react";
import { useFormStatus } from "react-dom";

export function DeleteProduct({
    id,
    setIsOpen,
}: {
    id: string;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const deleteInvoiceWithId = deleteProduct.bind(null, id);

    return (
        <form action={deleteInvoiceWithId} className="w-full">
            <DeleteButton setIsOpen={setIsOpen} />
        </form>
    );
}
function DeleteButton({
    setIsOpen,
}: {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const { pending } = useFormStatus();
    return (
        <Button
            color="danger"
            className="w-full"
            type="submit"
            isDisabled={pending}
            onClick={() => setIsOpen(false)}
        >
            Delete
        </Button>
    );
}
