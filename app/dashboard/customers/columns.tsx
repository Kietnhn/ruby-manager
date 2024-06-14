"use client";

import { getPublicIdFromUrl, renderId } from "@/lib/utils";
import { Avatar, Button, Tooltip } from "@nextui-org/react";
import { ColumnDef } from "@tanstack/react-table";
import { UserCustomer } from "@/lib/definitions";
import { Address, Order, UserKind } from "@prisma/client";
import clsx from "clsx";
import Link from "next/link";
import { EyeIcon } from "@heroicons/react/24/outline";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const columns: ColumnDef<UserCustomer>[] = [
    {
        accessorKey: "id",
        header: "Id",
        size: 80,
        enableSorting: false,
        cell: (props) => (
            <Tooltip content={props.getValue() as string}>
                <p> {renderId(props.getValue() as string)}</p>
            </Tooltip>
        ),
    },
    {
        accessorKey: "avatar",
        header: "Avatar",
        size: 120,
        enableSorting: false,

        cell: (props) => {
            const avatarUrl = props.getValue() as string;

            return (
                <div className="flex justify-center items-center">
                    <Avatar
                        alt={getPublicIdFromUrl(avatarUrl as string)}
                        src={avatarUrl}
                        name={props.row.original.firstName || ""}
                    />
                </div>
            );
        },
    },
    {
        accessorKey: "firstName",
        header: "FirstName",
        enableColumnFilter: true,
    },
    {
        accessorKey: "lastName",
        header: "LastName",
        enableColumnFilter: true,
    },
    {
        accessorKey: "email",
        header: "Email",
        enableColumnFilter: true,
    },
    {
        accessorKey: "gender",
        header: "Gender",
        enableColumnFilter: true,
        cell: (props) => {
            const gender = props.getValue() as string;

            return <p className="capitalize">{gender?.toLowerCase()}</p>;
        },
    },
    {
        accessorKey: "dateOfBirth",
        header: "DateOfBirth",
        enableColumnFilter: false,
        cell: (props) => {
            const date = props.getValue() as Date;
            return <p suppressHydrationWarning>{date?.toLocaleDateString()}</p>;
        },
    },
    {
        accessorKey: "kind",
        header: "Kind",
        cell: (props) => {
            const kind = props.getValue() as UserKind;
            return (
                <>
                    <p
                        className={clsx(" font-semibold", {
                            "text-yellow-500": kind === "VIP",
                            "text-gray-500": kind === "MEMBER",
                        })}
                    >
                        {kind}
                    </p>
                </>
            );
        },
    },
    {
        accessorKey: "orders",
        header: "Orders",
        cell: (props) => {
            const orders = props.getValue() as Order[];
            return (
                <p className="text-gray-500 pointer-events-none">
                    {orders?.length || 0}
                </p>
            );
        },
    },
    {
        accessorKey: "score",
        header: "Score",
        cell: (props) => {
            return (
                <p className="text-gray-500 pointer-events-none">
                    {props.getValue() as number}
                </p>
            );
        },
    },
    {
        accessorKey: "address",
        header: "Country",
        cell: (props) => {
            const address: Address = props.getValue() as Address;
            return <p>{address?.country}</p>;
        },
    },

    {
        accessorKey: "isVerified",
        header: "Account verified",
    },

    {
        header: "Actions",
        enableSorting: false,
        cell: (props) => {
            const id = props.row.original.id;
            return (
                <Tooltip content="View detail" showArrow>
                    <Link href={`/dashboard/customers/${id}`}>
                        <Button isIconOnly color="default">
                            <EyeIcon className="w-5 h-5" />
                        </Button>
                    </Link>
                </Tooltip>
            );
        },
    },
];
