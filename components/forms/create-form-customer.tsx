"use client";
import { createCustomer } from "@/lib/actions/user";
import { Country } from "@/lib/definitions";
import {
    ChevronDownIcon,
    ChevronUpIcon,
    EnvelopeIcon,
    KeyIcon,
    PhoneIcon,
    PlusIcon,
    UserIcon,
} from "@heroicons/react/24/outline";
import {
    Avatar,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Input,
    Radio,
    RadioGroup,
    Select,
    SelectItem,
    Textarea,
} from "@nextui-org/react";
import React, { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import CardWrapper from "../ui/card-wrapper";
import DefaultInput from "../ui/default-input";
import DefaultDatePicker from "../ui/default-date-picker";
import DefaultSelect from "../ui/default-select";
import DefaultTextArea from "../ui/default-textarea";

const CreateForm = ({ countries }: { countries: Country[] }) => {
    const initialState = { message: null, errors: {} };

    // @ts-ignore
    const [state, dispatch] = useFormState(createCustomer, initialState);
    return (
        <form action={dispatch} className="w-full flex gap-4">
            <CardWrapper
                className="flex-1"
                heading="Account informarion"
                classNames={{ body: "flex flex-col gap-4" }}
            >
                <div className="w-full flex gap-4">
                    <DefaultInput
                        wrapper="w-1/2"
                        name="firstName"
                        startContent={<UserIcon className="w-5 h-5" />}
                        errorMessage={state?.errors?.firstName?.at(0)}
                    />

                    <DefaultInput
                        wrapper="w-1/2"
                        name="lastName"
                        startContent={<UserIcon className="w-5 h-5" />}
                        errorMessage={state?.errors?.lastName?.at(0)}
                    />
                </div>
                <DefaultInput
                    errorMessage={state?.errors?.email?.at(0)}
                    name="email"
                    startContent={<EnvelopeIcon className="w-5 h-5" />}
                />

                <div className="w-full flex gap-4">
                    <div className="flex flex-col gap-4 w-1/2">
                        <div className="flex-1">
                            <RadioGroup
                                label="Select  gender"
                                orientation="horizontal"
                                name="gender"
                                id="gender"
                            >
                                <Radio value="MALE">Male</Radio>
                                <Radio value="FEMALE">Female</Radio>
                            </RadioGroup>
                        </div>
                        {state?.errors?.gender &&
                            state.errors?.gender.map((error: string) => (
                                <p
                                    className="mt-2 text-sm text-red-500"
                                    key={error}
                                >
                                    {error}
                                </p>
                            ))}
                    </div>
                    <DefaultDatePicker
                        granularity="day"
                        label="Day of Birth"
                        wrapper="w-1/2"
                        name="dateOfBirth"
                    />
                </div>
                <DefaultInput
                    placeholder="Enter phone number"
                    label="Phone Number"
                    name="phoneNumber"
                    startContent={<PhoneIcon className="w-5 h-5" />}
                    minLength={6}
                    errorMessage={state?.errors?.phoneNumber?.at(0)}
                />

                {state?.message && (
                    <p className="mt-2 text-sm text-red-500">
                        {state?.message}
                    </p>
                )}
                <CreateButton />
            </CardWrapper>
            <CardWrapper
                className="w-1/2 relative"
                heading="Shipping Address (Optional)"
                classNames={{ body: "flex flex-col gap-4" }}
            >
                <div>
                    <Select
                        items={countries}
                        name="country"
                        label="Country"
                        labelPlacement="outside"
                        variant="bordered"
                        placeholder="Select a country"
                        errorMessage={state?.errors?.country?.at(0)}
                        classNames={{
                            trigger: "h-12",
                        }}
                        renderValue={(items) => {
                            return items.map((item) => {
                                return (
                                    <div
                                        key={item.key}
                                        className="flex items-center gap-2"
                                    >
                                        <Avatar
                                            alt={item.data?.flags.alt}
                                            className="flex-shrink-0"
                                            size="sm"
                                            src={item.data?.flags.png}
                                        />
                                        <div className="flex gap-2 items-center">
                                            <span>
                                                {item.data?.name.common}
                                            </span>
                                            <span className="text-default-500 text-tiny">
                                                ({item.data?.flag})
                                            </span>
                                        </div>
                                    </div>
                                );
                            });
                        }}
                    >
                        {(country) => (
                            <SelectItem
                                key={country.name.common}
                                textValue={country.name.common}
                                value={country.name.common}
                            >
                                <div className="flex gap-2 items-center">
                                    <Avatar
                                        alt={country.flags.alt}
                                        className="flex-shrink-0"
                                        size="sm"
                                        src={country.flags.png}
                                    />
                                    <div className="flex gap-2 items-center">
                                        <span className="text-small">
                                            {country.name.common}
                                        </span>
                                        <span className="text-tiny text-default-400">
                                            {country.flag}
                                        </span>
                                    </div>
                                </div>
                            </SelectItem>
                        )}
                    </Select>
                    {state?.errors?.country &&
                        state.errors.country.map((error: string) => (
                            <p
                                className="mt-2 text-sm text-red-500"
                                key={error}
                            >
                                {error}
                            </p>
                        ))}
                </div>

                <DefaultInput name="city" />
                <DefaultInput name="state" />
                <DefaultTextArea name="addressLine" />
                <DefaultInput
                    name="postalCode"
                    errorMessage={state?.errors?.postalCode?.at(0)}
                />
            </CardWrapper>
        </form>
    );
};
const CreateButton = () => {
    const { pending } = useFormStatus();
    return (
        <Button
            type="submit"
            disabled={pending}
            className="w-full"
            color="primary"
        >
            <PlusIcon className="w-5 h-5" /> Create
        </Button>
    );
};
export default CreateForm;
