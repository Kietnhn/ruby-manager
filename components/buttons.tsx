"use client";

import {
    ArrowPathRoundedSquareIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { Button, ButtonProps, Tooltip } from "@nextui-org/react";
import Link from "next/link";
import React, { ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { useFormStatus } from "react-dom";
import { deleteCategory } from "@/lib/actions/category";
import { toast } from "react-toastify";
import { deletePage } from "@/lib/actions/page";
// import { useToast } from "@/contexts/toastContext";
// ...

export function DeleteButton({ action }: { action: () => Promise<void> }) {
    const { pending } = useFormStatus();

    return (
        <form action={action}>
            <Button
                color="danger"
                type="submit"
                className="w-full"
                isDisabled={pending}
            >
                <TrashIcon className="w-5 h-5" />
                Delete
            </Button>
        </form>
    );
}
export function ConfirmDelete({
    action,

    name,
    isShowTitle = false,
    content,
}: {
    action: () => Promise<void>;

    name: string;
    isShowTitle?: boolean;
    content?: string;
}) {
    const [isOpen, setIsOpen] = React.useState(false);
    const { pending } = useFormStatus();
    const handleDelete = async () => {
        await toast.promise(action, {
            pending: `Deleting ${name}...`,
            success: "Deleted successfully ",
            error: "Delete rejected ",
        });
        setIsOpen(false);
    };
    return (
        <Popover
            isOpen={isOpen}
            onOpenChange={(open) => setIsOpen(open)}
            placement="left-start"
            showArrow
            backdrop="opaque"
            classNames={{
                base: ["before:bg-default-200"],
                content: [
                    "py-3 px-4 border border-default-200",
                    "bg-gradient-to-br from-white to-default-300",
                    "dark:from-default-100 dark:to-default-50",
                ],
            }}
        >
            <PopoverTrigger>
                <Button
                    isIconOnly={!isShowTitle}
                    color="danger"
                    variant="bordered"
                >
                    <TrashIcon className="w-5 h-5" />
                    {isShowTitle && "Delete"}
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                {(titleProps) => (
                    <div className="px-1 py-2 w-full">
                        <p
                            className="text-small font-bold text-foreground"
                            {...titleProps}
                        >
                            Confirm delete
                        </p>
                        <p>
                            Are you sure to delete this <strong>{name}</strong>
                        </p>
                        <p className="text-red-500">{content}</p>
                        {content ? (
                            <p className="text-red-500 font-semibold">
                                This action can not undo
                            </p>
                        ) : (
                            <></>
                        )}
                        <div className="w-full flex gap-4 mt-4">
                            <div className="w-1/2">
                                <Button
                                    onClick={() => setIsOpen(false)}
                                    className="w-full"
                                >
                                    Cancel
                                </Button>
                            </div>
                            <div className="w-1/2 relative">
                                {/* <form action={action}> */}
                                <Button
                                    color="danger"
                                    type="submit"
                                    className="w-full"
                                    isDisabled={pending}
                                    onPress={handleDelete}
                                >
                                    <TrashIcon className="w-5 h-5" />
                                    Delete
                                </Button>
                                {/* </form> */}
                            </div>
                        </div>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
export function DeepDeleteCategory({
    action,
}: {
    action: () => Promise<void>;
}) {
    return (
        <ConfirmDelete
            name="category"
            content="All relative products and categories will unset this category"
            action={action}
        />
    );
}

export function DeletePage({ id }: { id: string }) {
    const deletePageWithId = deletePage.bind(null, id);

    return (
        <form action={deletePageWithId}>
            <Button color="danger" type="submit">
                Delete
            </Button>
        </form>
    );
}
export function EditCategory({ action }: { action: () => Promise<void> }) {
    return (
        <form action={action}>
            <Button isIconOnly>
                <PencilIcon className="w-5 h-5" />
                Edit
            </Button>
        </form>
    );
}

export function EditLinkButton({
    href,
    content,
}: {
    href: string;
    content: string;
}) {
    return (
        <Link href={href}>
            <Tooltip content={content} showArrow>
                <Button isIconOnly color="warning" variant="bordered">
                    <PencilIcon className="h-5 w-5" />
                </Button>
            </Tooltip>
        </Link>
    );
}
interface IViewLinkButtonProps extends ButtonProps {
    href: string;
    content: string;
}

export function ViewLinkButton(props: IViewLinkButtonProps) {
    const { href, content, ...rest } = props;
    return (
        <Link href={href}>
            <Tooltip content={content} showArrow>
                <Button isIconOnly color="primary" variant="bordered" {...rest}>
                    <EyeIcon className="h-5 w-5" />
                </Button>
            </Tooltip>
        </Link>
    );
}
export function RestoreButton({ action }: { action: () => Promise<void> }) {
    const { pending } = useFormStatus();
    return (
        <form action={action}>
            <Tooltip content="Restore" showArrow>
                <Button
                    type="submit"
                    color="success"
                    isIconOnly
                    isDisabled={pending}
                    variant="bordered"
                >
                    <ArrowPathRoundedSquareIcon className="w-5 h-5" />
                </Button>
            </Tooltip>
        </form>
    );
}
