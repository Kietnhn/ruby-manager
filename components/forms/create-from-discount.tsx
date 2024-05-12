"use client";
import { DEFAULT_LOCALE, DISCOUNTS_TYPE } from "@/lib/constants";
import { Button, DatePicker, Select, SelectItem } from "@nextui-org/react";
import { I18nProvider } from "@react-aria/i18n";

import DefaultInput from "../ui/default-input";
import { CurrencyDollarIcon, PlusIcon } from "@heroicons/react/24/outline";
import { toCapitalize } from "@/lib/utils";
import { useState } from "react";
import { DiscountType } from "@prisma/client";
import { useFormState, useFormStatus } from "react-dom";
import CardWrapper from "../ui/card-wrapper";
import CustomSwitch from "../ui/custom-switch";

import { createDiscount } from "@/lib/actions/discounts";
import DefaultSelect from "../ui/default-select";
import DefaultDatePicker from "../ui/default-date-picker";
export default function CreateFormDiscount() {
    const initialState = { message: null, errors: {} };

    const [selectedType, setSelectedType] =
        useState<DiscountType>("PERCENTAGE");
    // @ts-ignore
    const [state, dispatch] = useFormState(createDiscount, initialState);

    const handleSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as DiscountType;
        if (!value) return;
        setSelectedType(value);
    };

    return (
        <form className="w-full flex justify-center gap-4" action={dispatch}>
            <CardWrapper
                className="w-1/2"
                heading="Create discount form"
                classNames={{
                    body: "flex  flex-col gap-4 justify-between",
                }}
            >
                <div className="flex gap-4">
                    <DefaultInput
                        name="name"
                        errorMessage={state?.errors?.name?.at(0)}
                        wrapper="w-3/5"
                    />

                    <DefaultInput
                        name="code"
                        errorMessage={state?.errors?.code?.at(0)}
                        wrapper="w-2/5"
                    />
                </div>
                <DefaultInput
                    name="description"
                    errorMessage={state?.errors?.description?.at(0)}
                />
                <div className="flex gap-4">
                    <DefaultSelect
                        name="discountType"
                        // label="Discount Type"
                        wrapper="w-1/3"
                        onChange={handleSelected}
                        selectedKeys={[selectedType]}
                        errorMessage={state?.errors?.discountType?.at(0)}
                        description={
                            selectedType === "FIXED"
                                ? "Instant savings with fixed discounts!"
                                : selectedType === "PERCENTAGE"
                                ? "Save big with percentage discounts!"
                                : "Affordable shipping options available!"
                        }
                    >
                        {DISCOUNTS_TYPE.map((item) => (
                            <SelectItem
                                key={item}
                                value={item}
                                className="capitalize"
                            >
                                {toCapitalize(item)}
                            </SelectItem>
                        ))}
                    </DefaultSelect>

                    <DefaultInput
                        name="value"
                        type="number"
                        min={0}
                        step={"any"}
                        placeholder="Enter value of discount "
                        startContent={
                            <CurrencyDollarIcon className="pointer-events-none h-4 w-4  text-gray-500 peer-focus:text-gray-900" />
                        }
                        endContent={
                            <Button isDisabled isIconOnly variant="light">
                                {selectedType === "PERCENTAGE" ? "%" : "USD"}
                            </Button>
                        }
                        errorMessage={state?.errors?.value?.at(0)}
                        wrapper="w-2/3"
                    />
                </div>
                <div className="flex gap-4">
                    <DefaultInput
                        name="quantity"
                        type="number"
                        min={0}
                        step={"any"}
                        errorMessage={state?.errors?.quantity?.at(0)}
                        wrapper="w-1/2"
                        description="Number of discount"
                    />
                    <DefaultInput
                        label="Min total price (Optional)"
                        name="minTotalPrice"
                        defaultValue="0"
                        type="number"
                        min={0}
                        step={"any"}
                        endContent={
                            <Button isDisabled isIconOnly variant="light">
                                USD
                            </Button>
                        }
                        description="The minimum total price of order can use this discount"
                        errorMessage={state?.errors?.minTotalPrice?.at(0)}
                        wrapper="w-1/2"
                    />
                </div>
                <div className="flex gap-4 flex-nowrap">
                    <DefaultDatePicker
                        name="startDate"
                        label="Start date"
                        errorMessage={state?.errors?.startDate?.at(0)}
                        wrapper="w-1/2"
                    />
                    <DefaultDatePicker
                        name="endDate"
                        label="End date"
                        errorMessage={state?.errors?.endDate?.at(0)}
                        wrapper="w-1/2"
                    />
                </div>
                <CustomSwitch name="isPublic" classNames={{ base: "p-0" }}>
                    <div className="flex flex-col  p-4">
                        <p className="text-small font-semibold">
                            Public discount
                        </p>
                        <small>Everyone can use this discount</small>
                    </div>
                </CustomSwitch>
                {state?.message && (
                    <div>
                        <p className=" text-sm text-red-500">{state.message}</p>
                    </div>
                )}
                <CreateButton />
            </CardWrapper>
        </form>
    );
}
function CreateButton() {
    const { pending } = useFormStatus();
    return (
        <Button isDisabled={pending} type="submit" color="primary">
            <PlusIcon className="w-5 h-5" />
            Add
        </Button>
    );
}
