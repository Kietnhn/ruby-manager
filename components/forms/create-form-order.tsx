"use client";
import {
    Avatar,
    Button,
    Card,
    CardBody,
    CardHeader,
    Input,
    Link,
    Select,
    SelectItem,
} from "@nextui-org/react";
import React, { useMemo, useState } from "react";
import { User } from "@prisma/client";
import { FullOrderProduct } from "@/lib/definitions";

import { ORDER_STATUS, PAYMENT_METHODS } from "@/lib/constants";
import CreateOrderTable from "../orders/create-order-table";
import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import { createOrder } from "@/lib/actions/order";
import { renderPrice } from "@/lib/utils";
import CardWrapper from "../ui/card-wrapper";
import DefaultInput from "../ui/default-input";
import DefaultSelect from "../ui/default-select";

const CreateForm = ({
    customers,
    employee,
}: {
    customers: User[];
    employee: string;
}) => {
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
                <CardWrapper heading="Order details" className="w-3/4">
                    <CreateOrderTable data={data} setData={setData} />
                    <div className="flex justify-end items-center ">
                        <div className=" w-1/3">
                            <div className="w-full flex mb-1">
                                <div className="w-1/2">
                                    <small className="leading-4 text-gray-500">
                                        SubTotal:
                                    </small>
                                </div>
                                <div className="w-1/2">
                                    <strong>{renderPrice(subTotal)}</strong>
                                </div>
                            </div>
                            <div className="w-full flex mb-1">
                                <div className="w-1/2">
                                    <small className="leading-4 text-gray-500">
                                        Estimated Delivery & Handling:
                                    </small>
                                </div>
                                <div className="w-1/2 flex items-end">
                                    <strong>{renderPrice(0)}</strong>
                                </div>
                            </div>
                            <div className="w-full flex mb-1">
                                <div className="w-1/2">
                                    <small className="leading-4 text-gray-500">
                                        Total:
                                    </small>
                                </div>
                                <div className="w-1/2">
                                    <strong>{renderPrice(subTotal)}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end items-center">
                        <div className="w-1/3 my-2">
                            {state?.message && (
                                <p className="text-red-500">{state.message}</p>
                            )}
                            <CreateOrderButton data={data} />
                        </div>
                    </div>
                </CardWrapper>
                <CardWrapper
                    className="w-1/4"
                    heading=" Order information"
                    classNames={{ body: "flex flex-col gap-4" }}
                >
                    <DefaultInput
                        name="employee"
                        isReadOnly
                        value={employee}
                        defaultValue={employee}
                        errorMessage={state?.errors?.employee?.at(0)}
                    />

                    <Select
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
                    </Select>
                    {state?.errors?.customer &&
                        state.errors.customer.map((error: string) => (
                            <p
                                className="mt-2 text-sm text-red-500"
                                key={error}
                            >
                                {error}
                            </p>
                        ))}
                    {/* <Link
                                    className="my-2"
                                    href="/dashboard/orders/createWithUser"
                                    underline="hover"
                                >
                                    Not have account yet?
                                </Link> */}
                    <DefaultSelect
                        name="paymentMethod"
                        errorMessage={state?.errors?.paymentMethod?.at(0)}
                        label="Payment method"
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
