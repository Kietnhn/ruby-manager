"use client";

import { useAppSelector } from "@/lib/store";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { Button, Input } from "@nextui-org/react";
import { ChangeEvent, useMemo, useState } from "react";

export default function CardCheckout() {
    return (
        <div className="flex flex-col gap-4">
            <div className="w-full ">
                <Input
                    name="name"
                    label="Name on card"
                    variant="bordered"
                    placeholder="Type name on card"
                />
            </div>
            <div className="w-full ">
                <Input
                    name="cardNumber"
                    label="Card Number"
                    variant="bordered"
                    placeholder="XXXX XXXX XXXX XXXX"
                />
            </div>
            <div className="flex flex-nowrap gap-4">
                <div className="w-1/2 ">
                    <Input
                        name="expirationDate"
                        label="Expiration Date"
                        variant="bordered"
                        placeholder="mm/yy"
                    />
                </div>
                <div className="w-1/2 ">
                    <Input
                        name="cvv"
                        label="CVV"
                        variant="bordered"
                        placeholder="***"
                    />
                </div>
            </div>
        </div>
    );
}
export function OfflinePaymentForm() {
    const { cart } = useAppSelector((store) => store.order);
    const [change, setChange] = useState<string>("");
    const totalPrice = useMemo(
        () =>
            cart.reduce((prev, current) => {
                const currentPrice =
                    current.product.salePrice || current.product.price;
                return (prev += currentPrice * current.quantity);
            }, 0),
        [cart]
    );
    const handleCaculateChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!value || isNaN(+value)) return;
        if (+value < totalPrice) return;
        const amountChange = +value - totalPrice;
        setChange(amountChange.toString());
    };

    return (
        <div className="flex flex-col gap-4">
            <Input
                label="Cash received"
                onChange={handleCaculateChange}
                placeholder="Enter the amount of cash received from customer"
                type="number"
                step="any"
                min={totalPrice}
                errorMessage="Invalid received amount "
                variant="bordered"
                startContent={
                    <CurrencyDollarIcon className="pointer-events-none h-4 w-4  text-gray-500 peer-focus:text-gray-900" />
                }
                endContent={
                    <Button isDisabled isIconOnly variant="light">
                        USD
                    </Button>
                }
            />
            <Input
                startContent={
                    <CurrencyDollarIcon className="pointer-events-none h-4 w-4  text-gray-500 peer-focus:text-gray-900" />
                }
                endContent={
                    <Button isDisabled isIconOnly variant="light">
                        USD
                    </Button>
                }
                label="Cash change"
                readOnly
                variant="bordered"
                value={change}
                defaultValue="0"
                type="number"
                step="any"
            />
        </div>
    );
}
