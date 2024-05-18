"use client";

import SearchProductInput from "../search/product-input";
import SearchProductResult from "../search/product-result";
import BottomContent from "./bottom-content";
import CartOrder from "./cart-order";
import OrderSteps from "./step-order";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { motion } from "framer-motion";
import OrderPayment from "./order-payment";
import { Button } from "@nextui-org/react";
import { setCurrentStep } from "@/features/order-slice";
import InputDiscount from "./input-discount";
export default function CreateOrderForm() {
    const { currentStep, cart, paymentMethod } = useAppSelector(
        (store) => store.order
    );
    const dispatch = useAppDispatch();
    const handleNextStep = () => {
        dispatch(setCurrentStep(currentStep + 1));
    };
    const handleBackStep = () => {
        if (currentStep === 0) return;

        dispatch(setCurrentStep(currentStep - 1));
    };
    return (
        <div className="w-full flex flex-col gap-4">
            <OrderSteps />
            <motion.div layout>
                {currentStep === 0 ? (
                    <div className="relative flex gap-4 flex-nowrap">
                        <div className="w-7/12">
                            <div className="w-full flex flex-col gap-4">
                                <SearchProductInput />
                                <SearchProductResult />
                            </div>
                        </div>
                        <div className="w-5/12 flex flex-col gap-4">
                            <CartOrder />
                            <div className="flex justify-end items-center">
                                <Button
                                    onClick={handleNextStep}
                                    color="primary"
                                    isDisabled={cart.length === 0}
                                >
                                    Move to payment
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : currentStep === 1 ? (
                    <div className="flex flex-col gap-4">
                        <div className="relatice flex gap-4 flex-nowrap">
                            <div className="w-7/12">
                                <OrderPayment />
                            </div>
                            <div className="w-5/12 flex flex-col gap-4">
                                <CartOrder />
                                <InputDiscount />
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <Button onClick={handleBackStep}>
                                Back to order
                            </Button>
                            <Button
                                onClick={handleNextStep}
                                color="primary"
                                isDisabled={!paymentMethod}
                            >
                                Checkout
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div>Review</div>
                )}
            </motion.div>
            {/* <BottomContent /> */}
        </div>
    );
}
