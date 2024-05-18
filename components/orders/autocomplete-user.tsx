"use client";
import React, { Key, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { Autocomplete, AutocompleteItem, Input, User } from "@nextui-org/react";
import { UserNoPassword } from "@/lib/definitions";
import { useDebouncedCallback } from "use-debounce";
import { searchUser } from "@/lib/actions/user";
export default function AutocomleteUsers() {
    const [searchData, setSearchData] = useState<UserNoPassword[]>([]);
    const [customer, setCustomer] = useState<string | null>("");
    const handleFindUser = async (value: string) => {
        const users = await searchUser(value);

        setSearchData(users);
    };
    const handleChangeInput = useDebouncedCallback((value: string) => {
        if (!value) return;
        handleFindUser(value);
    }, 300);
    const handleSelectCustomer = (value: Key | null) => {
        if (!value) return;
        setCustomer(value as string);
    };
    return (
        <>
            <Input
                classNames={{
                    inputWrapper: "hidden",
                    label: "hidden",
                    base: "	visibility: hidden;",
                }}
                name="customer"
                value={customer || undefined}
            />
            <Autocomplete
                onInputChange={handleChangeInput}
                className="rounded-tr-none rounded-br-none "
                label="Customer"
                placeholder="Enter email ..."
                labelPlacement="outside"
                inputProps={{
                    classNames: { mainWrapper: "flex-1" },
                }}
                variant="bordered"
                startContent={<MagnifyingGlassIcon className="w-5 h-5" />}
                selectedKey={customer || undefined}
                onSelectionChange={handleSelectCustomer}
            >
                {searchData.map((user, index) => (
                    <AutocompleteItem
                        key={user.id}
                        textValue={user.email as string}
                        value={user.id}
                        className="outline-none"
                    >
                        <User
                            name={
                                user.name ||
                                user.firstName ||
                                user.email?.split("@")[0]
                            }
                            description={user.email as string}
                            avatarProps={{
                                src: user.image || undefined,
                                alt: user.email || undefined,
                            }}
                        />
                    </AutocompleteItem>
                ))}
            </Autocomplete>
        </>
    );
}
