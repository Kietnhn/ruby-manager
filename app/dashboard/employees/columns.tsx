"use client";

import { getPublicIdFromUrl, renderId } from "@/lib/utils";
import { Avatar, Button, Tooltip } from "@nextui-org/react";
import { ColumnDef } from "@tanstack/react-table";
import { UserEmployee } from "@/lib/definitions";
import { Address, Order, UserKind } from "@prisma/client";
import clsx from "clsx";
import Link from "next/link";
import { EyeIcon } from "@heroicons/react/24/outline";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const columns: ColumnDef<UserEmployee>[] = [
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
        accessorKey: "image",
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
                        name={
                            props.row.original.name ||
                            props.row.original.firstName ||
                            undefined
                        }
                    />
                </div>
            );
        },
    },
    {
        accessorKey: "name",
        header: "Name",
        enableColumnFilter: true,
    },
    // {
    //     accessorKey: "lastName",
    //     header: "LastName",
    //     enableColumnFilter: true,
    // },
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
        accessorKey: "role",
        header: "Role",
        sortingFn: (rowA, rowB, columnId) => {
            return rowA.original.employee.role > rowB.original.employee.role
                ? 1
                : -1;
        },
        cell: (props) => {
            const role = props.row.original.employee.role;
            return (
                <p
                    className={clsx("text-gray-500", {
                        "text-warning-500": role === "ADMIN",
                        "text-secondary-500": role === "MANAGER",
                    })}
                >
                    {role}
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
        accessorKey: "phoneNumber",
        header: "Phone",
    },
    {
        accessorKey: "hireDate",
        header: "Hired Date",
        cell: (props) => {
            const employee = props.row.original.employee;
            const hireDate = employee.hireDate;
            return (
                <p suppressHydrationWarning>{hireDate.toLocaleDateString()}</p>
            );
        },
    },
    {
        accessorKey: "salary",
        header: "Salary",
        cell: (props) => {
            const employee = props.row.original.employee;
            const salary = employee.salary;
            return <p>{salary}</p>;
        },
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
