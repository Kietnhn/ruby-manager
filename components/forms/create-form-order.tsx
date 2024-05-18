"use client";
import { Button, SelectItem } from "@nextui-org/react";
import React, { useMemo, useState } from "react";
import { FullOrderProduct } from "@/lib/definitions";

import { PAYMENT_METHODS } from "@/lib/constants";
import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import { createOrder } from "@/lib/actions/order";
import { renderPrice } from "@/lib/utils";
import CardWrapper from "../ui/card-wrapper";
import DefaultInput from "../ui/default-input";
import DefaultSelect from "../ui/default-select";
import AutocomleteProducts from "../orders/autocomlete-products";
import { DataTable } from "../data-table";
import { columns } from "@/app/dashboard/orders/create/columns";
import AutocomleteUsers from "../orders/autocomplete-user";

const CreateForm = ({ employee }: { employee: string }) => {
    const [data, setData] = useState<FullOrderProduct[]>([]);
    const initialState = { message: null, errors: {} };

    const createOrderWithOrderProducts = createOrder.bind(null, data);
    //@ts-ignore
    const [state, dispatch] = useFormState(
        createOrderWithOrderProducts,
        initialState
    );
    const subTotal = useMemo(
        () => data.reduce((prev, current) => (prev += current.subTotal), 0),
        [data]
    );
    return (
        <main>
            <form className="flex gap-4" action={dispatch}>
                <CardWrapper heading="Order details" className="w-2/3">
                    <AutocomleteProducts data={data} setData={setData} />

                    <DataTable
                        data={data}
                        setData={setData}
                        columns={columns}
                    />
                </CardWrapper>
                <CardWrapper className="w-1/3" heading=" Order information">
                    <DefaultInput
                        name="employee"
                        isReadOnly
                        value={employee}
                        defaultValue={employee}
                        errorMessage={state?.errors?.employee?.at(0)}
                    />

                    {/* <Select
                        items={customers}
                        name="customer"
                        label="Customer"
                        placeholder="Select a customer"
                        variant="bordered"
                        labelPlacement="outside"
                        renderValue={(items) => {
                            return items.map((item) => (
                                <div
                                    key={item.key}
                                    className="flex items-center gap-2"
                                >
                                    <Avatar
                                        alt={item.data?.name as string}
                                        className="flex-shrink-0"
                                        size="sm"
                                        src={item.data?.image as string}
                                    />
                                    <div className="flex gap-2 items-center">
                                        <span>
                                            {item.data?.firstName}
                                            {item.data?.lastName}
                                        </span>
                                        <span className="text-default-500 text-tiny">
                                            ({item.data?.email})
                                        </span>
                                    </div>
                                </div>
                            ));
                        }}
                    >
                        {(customer) => (
                            <SelectItem
                                key={customer.id}
                                textValue={customer.id}
                                value={customer.id}
                            >
                                <div className="flex gap-2 items-center">
                                    <Avatar
                                        alt={customer.name as string}
                                        className="flex-shrink-0"
                                        size="sm"
                                        src={customer.image as string}
                                    />
                                    <div className="flex gap-2 items-center">
                                        <span className="text-small">
                                            {customer.firstName}

                                            {customer.lastName}
                                        </span>
                                        <span className="text-tiny text-default-400">
                                            {customer.email}
                                        </span>
                                    </div>
                                </div>
                            </SelectItem>
                        )}
                    </Select> */}
                    <div>
                        <AutocomleteUsers />
                        {state?.errors?.customer &&
                            state.errors.customer.map((error: string) => (
                                <p
                                    className="mt-2 text-sm text-red-500"
                                    key={error}
                                >
                                    {error}
                                </p>
                            ))}
                    </div>

                    <DefaultSelect
                        name="paymentMethod"
                        errorMessage={state?.errors?.paymentMethod?.at(0)}
                        label="Payment method"
                        disabledKeys={["COD"]}
                    >
                        {PAYMENT_METHODS.map((paymentMethod) => (
                            <SelectItem
                                key={paymentMethod}
                                value={paymentMethod}
                                textValue={paymentMethod}
                            >
                                <p className="">
                                    {paymentMethod.split("_").join(" ")}
                                </p>
                            </SelectItem>
                        ))}
                    </DefaultSelect>
                    <div className="flex flex-col gap-1 ">
                        <div className=" flex justify-between items-center">
                            <small className=" text-foreground-500">
                                SubTotal:
                            </small>
                            <strong>{renderPrice(subTotal)}</strong>
                        </div>

                        <div className=" flex justify-between items-center">
                            <small className=" text-foreground-500">
                                Estimated Delivery & Handling:
                            </small>
                            <strong>{renderPrice(0)}</strong>
                        </div>

                        <div className=" flex justify-between items-center">
                            <small className=" text-foreground-500">
                                Total:
                            </small>
                            <strong>{renderPrice(subTotal)}</strong>
                        </div>
                    </div>
                    {state?.message && (
                        <p className="text-red-500">{state.message}</p>
                    )}
                    <CreateOrderButton data={data} />
                </CardWrapper>
            </form>
        </main>
    );
};
function CreateOrderButton({ data }: { data: FullOrderProduct[] }) {
    const { pending } = useFormStatus();
    return (
        <Button
            type="submit"
            color="primary"
            className="w-full"
            isDisabled={data.length === 0 || pending}
        >
            Checkout
        </Button>
    );
}
export default CreateForm;
