// ...

import { deleteCollection } from "@/lib/actions";
import { Button } from "@nextui-org/react";
import { useFormStatus } from "react-dom";

export function DeleteCollection({ id }: { id: string }) {
    const deleteInvoiceWithId = deleteCollection.bind(null, id);

    return (
        <form action={deleteInvoiceWithId} className="w-full">
            <DeleteButton />
        </form>
    );
}
function DeleteButton() {
    const { pending } = useFormStatus();
    return (
        <Button
            color="danger"
            className="w-full"
            type="submit"
            isDisabled={pending}
        >
            Delete
        </Button>
    );
}
