"use client";

import { setCart, setCurrentStep } from "@/features/order-slice";
import { ICart } from "@/lib/definitions";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { getPublicIdFromUrl, renderPrice } from "@/lib/utils";
import { Badge, Button, Image, Input } from "@nextui-org/react";
import { ChangeEvent, FocusEvent, useMemo, useState } from "react";
import CardWrapper from "../ui/card-wrapper";

export default function CartOrder() {
    const { cart } = useAppSelector((store) => store.order);

    const subTotal = useMemo(
        () =>
            cart.reduce((prev, current) => {
                const currentPrice =
                    current.product.salePrice || current.product.price;
                return (prev += currentPrice * current.quantity);
            }, 0),
        [cart]
    );

    return (
        <CardWrapper heading="Cart">
            <div className="flex flex-col gap-2">
                {cart.map((cartItem, index) => (
                    <CartItem iCart={cartItem} key={index} />
                ))}
            </div>
            <div className="flex flex-col gap-1 ">
                <div className=" flex justify-between items-center">
                    <small className=" text-foreground-500">SubTotal:</small>
                    <strong>{renderPrice(subTotal)}</strong>
                </div>

                <div className=" flex justify-between items-center">
                    <small className=" text-foreground-500">
                        Estimated Delivery & Handling:
                    </small>
                    <strong>{renderPrice(0)}</strong>
                </div>

                <div className=" flex justify-between items-center">
                    <small className=" text-foreground-500">Total:</small>
                    <strong>{renderPrice(subTotal)}</strong>
                </div>
            </div>
        </CardWrapper>
    );
}
function CartItem({ iCart }: { iCart: ICart }) {
    const { variation, product, quantity, variationId } = iCart;
    const subTotal = useMemo(
        () =>
            product.salePrice
                ? product.salePrice * quantity
                : product.price * quantity,
        [iCart]
    );
    const [inputValue, setInputValue] = useState<string>(quantity.toString());
    const { cart } = useAppSelector((store) => store.order);
    const dispatch = useAppDispatch();
    const handleBlur = (e: any) => {
        const newCart: ICart[] = cart.map((item) =>
            item.variationId === variationId
                ? { ...item, quantity: +inputValue }
                : item
        );

        dispatch(setCart(newCart));
    };
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numberValue = +value;
        if (isNaN(numberValue)) return;
        if (numberValue > variation.stock) return;
        setInputValue(value);
    };
    return (
        <div className="flex justify-between items-center gap-2">
            {/* <Badge content={iCart.quantity}> */}
            <Image
                className="w-16 aspect-square object-cover"
                src={variation.images[0]}
                alt={getPublicIdFromUrl(variation.images[0] as string)}
            />
            {/* </Badge> */}
            <div className="flex-1 flex justify-between items-center">
                <div>
                    <h3 className="font-semibold">
                        {variation.name || product.name}
                    </h3>
                    <p className="text-small ">
                        {variation.color}/ {variation.size}
                    </p>
                </div>
                <div>
                    <Input
                        endContent={
                            <span className="text-xs text-foreground-500">
                                /{variation.stock}
                            </span>
                        }
                        value={inputValue}
                        onChange={handleChange}
                        type="number"
                        min={1}
                        max={Math.min(variation.stock, 10)}
                        variant="bordered"
                        aria-label="quantity"
                        className="max-w-40 border-sm"
                        onBlur={handleBlur}
                    />
                </div>

                <strong suppressHydrationWarning>
                    {renderPrice(subTotal, product.priceCurrency)}
                </strong>
            </div>
        </div>
    );
}
