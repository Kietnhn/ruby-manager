"use client";

import { renderId } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import {
    FullEmployee,
    OrderEmployeeCustomer,
    PageContainParent,
} from "@/lib/definitions";
import { Button, Chip, Tooltip } from "@nextui-org/react";
import {
    OrderStatus,
    Page,
    PageStatus,
    PaymentStatus,
    User,
} from "@prisma/client";
import {
    CheckIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    EyeIcon,
    PencilIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const columns: ColumnDef<PageContainParent>[] = [
    {
        accessorKey: "title",
        header: "Title",
    },

    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "handle",
        header: "handle",
    },
    {
        accessorKey: "url",
        header: "URL",
    },
    {
        accessorKey: "visibility",
        header: "Visibility",
        cell: (props) => {
            const status = props.getValue() as PageStatus;
            return (
                <strong
                    className={clsx("", {
                        "text-success-500": status === "PUBLIC",
                        "text-danger-500": status === "PRIVATE",
                    })}
                >
                    {props.getValue() as string}
                </strong>
            );
        },
    },
    {
        accessorKey: "public",
        header: "Public",
        cell: (props) => {
            const publicDate = props.getValue() as Date;
            return (
                <p className="" suppressHydrationWarning>
                    {publicDate?.toLocaleDateString()}
                </p>
            );
        },
    },

    {
        accessorKey: "createdAt",
        header: "Created at",
        cell: (props) => {
            const createdAt = props.getValue() as Date;
            return (
                <p className="" suppressHydrationWarning>
                    {createdAt?.toLocaleDateString()}
                </p>
            );
        },
    },
    {
        accessorKey: "updatedAt",
        header: "Updated at",
        cell: (props) => {
            const updatedAt = props.getValue() as Date;
            return (
                <p className="" suppressHydrationWarning>
                    {updatedAt?.toLocaleDateString()}
                </p>
            );
        },
    },

    {
        header: "Actions",
        enableSorting: false,
        cell(props) {
            const orderId = props.row.original.id;
            return (
                <div className="">
                    <Tooltip content="Edit" showArrow>
                        <Link href={`/dashboard/pages/${orderId}/edit`}>
                            <Button isIconOnly color="warning" variant="light">
                                <PencilIcon className="w-5 h-5" />
                            </Button>
                        </Link>
                    </Tooltip>
                </div>
            );
        },
    },
];
