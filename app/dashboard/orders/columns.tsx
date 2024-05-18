"use client";

import { renderId, renderPrice } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { FullEmployee, OrderEmployeeCustomer } from "@/lib/definitions";
import { Button, Chip, Tooltip } from "@nextui-org/react";
import { OrderStatus, PaymentStatus, User } from "@prisma/client";
import {
    CheckIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    EyeIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { ViewLinkButton } from "@/components/buttons";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const columns: ColumnDef<OrderEmployeeCustomer>[] = [
    {
        accessorKey: "id",
        header: "Id",
        size: 80,
        enableSorting: false,
        cell: (props) => (
            <Tooltip content={props.getValue() as string}>
                <p className="hover:cursor-default">
                    {renderId(props.getValue() as string)}
                </p>
            </Tooltip>
        ),
    },

    {
        accessorKey: "user",
        header: "Customer",
        cell: (props) => {
            const customer = props.getValue() as User;
            return (
                <Tooltip content={customer.email}>
                    <p className="max-w-36 line-clamp-1 overflow-hidden break-all  hover:cursor-default">
                        {customer.email}
                    </p>
                </Tooltip>
            );
        },
    },
    {
        accessorKey: "employee",
        header: "Employee",
        cell: (props) => {
            const employee = props.getValue() as FullEmployee;

            return (
                <Tooltip content={employee?.user?.email}>
                    <p className="max-w-36 line-clamp-1 overflow-hidden break-all hover:cursor-default">
                        {employee?.user?.email}
                    </p>
                </Tooltip>
            );
        },
    },
    {
        accessorKey: "quantity",
        header: "Quantity",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: (props) => {
            const status = props.getValue() as OrderStatus;
            return (
                <strong
                    className={clsx("", {
                        "text-primary": status === "CREATED",
                        "text-warning-500": status === "PROCESSING",
                        "text-danger-500": status === "CANCELLED",
                        "text-success-500": status === "COMPLETED",
                    })}
                >
                    {props.getValue() as string}
                </strong>
            );
        },
    },
    {
        accessorKey: "paymentMethod",
        header: "Payment method",
    },
    {
        accessorKey: "paymentStatus",
        header: "Payment status",
        cell: (props) => {
            const status = props.getValue() as PaymentStatus;
            return (
                <>
                    {status === "PAID" ? (
                        <Chip
                            startContent={<CheckIcon className="w-5 h-5" />}
                            variant="bordered"
                            color="success"
                        >
                            PAID
                        </Chip>
                    ) : status === "PENDING" ? (
                        <Chip
                            startContent={
                                <ExclamationTriangleIcon className="w-5 h-5" />
                            }
                            variant="bordered"
                            color="warning"
                        >
                            PENDING
                        </Chip>
                    ) : (
                        <Chip
                            variant="bordered"
                            color="danger"
                            startContent={
                                <ExclamationCircleIcon className="w-5 h-5" />
                            }
                        >
                            FAILED
                        </Chip>
                    )}
                </>
            );
        },
    },
    {
        accessorKey: "totalPrice",
        header: "Total Price",
        cell: (props) => {
            const totalPrice = props.getValue() as number;
            const priceCurrency = props.row.original.priceCurrency;
            return <strong>{renderPrice(totalPrice, priceCurrency)}</strong>;
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
    // {
    //     accessorKey: "processedAt",
    //     header: "Processed at",
    //     cell: (props) => {
    //         const processedAt = props.getValue() as Date;
    //         return (
    //             <p className="" suppressHydrationWarning>
    //                 {processedAt?.toLocaleDateString() || "null"}
    //             </p>
    //         );
    //     },
    // },
    {
        accessorKey: "completedAt",
        header: "Completed at",
        cell: (props) => {
            const completedAt = props.getValue() as Date;
            return (
                <p className="" suppressHydrationWarning>
                    {completedAt?.toLocaleDateString() || "Not completed yet"}
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
                <ViewLinkButton
                    content="View detail"
                    href={`/dashboard/orders/${orderId}`}
                />
            );
        },
    },
];
