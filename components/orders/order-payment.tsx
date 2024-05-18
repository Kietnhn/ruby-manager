"use client";

import { Card, Input, RadioGroup } from "@nextui-org/react";
import { CollapseRadio } from "../ui/collapse-radio";
import {
    BanknotesIcon,
    ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch } from "@/lib/store";
import { PaymentMethods } from "@prisma/client";
import { setPaymentMethod } from "@/features/order-slice";
import CardCheckout, { OfflinePaymentForm } from "../card-checkout";

export default function OrderPayment() {
    const unsupportedMethods: PaymentMethods[] = ["BANK_TRANSFER", "PAYPAL"];

    const dispatch = useAppDispatch();
    const handleSelectPaymentMethod = (value: string) => {
        if (unsupportedMethods.includes(value as PaymentMethods)) {
            dispatch(setPaymentMethod(null));
            return;
        }
        dispatch(setPaymentMethod(value as PaymentMethods));
    };
    return (
        <RadioGroup
            aria-label="radio-collapse"
            // defaultValue={"CREDIT_CARD"}
            onValueChange={handleSelectPaymentMethod}
        >
            <CollapseRadio title="Offline" value={"OFFLINE"}>
                <OfflinePaymentForm />
            </CollapseRadio>
            <CollapseRadio title="Credit card" value={"CREDIT_CARD"}>
                <CardCheckout />
            </CollapseRadio>
            {/* <CollapseRadio title="Debit card" value={"DEBIT_CARD"}>
                <CardCheckout />
            </CollapseRadio> */}
            <CollapseRadio title="Paypal" value={"PAYPAL"}>
                <UnSupportedPaythodMethod />
            </CollapseRadio>
            <CollapseRadio title="Bank transfer" value={"BANK_TRANSFER"}>
                <UnSupportedPaythodMethod />
            </CollapseRadio>
            {/* <CollapseRadio
                title="COD"
                value={"COD"}
                description="(cash on delivery)"
                isDisabled
            >
                <ExclamationCircleIcon className="w-5 h-5 float-start mr-2" />
                <p>
                    We kindly remind you that choosing Cash on Delivery means
                    you'll pay in cash upon delivery of your order. Please
                    ensure to have the exact amount ready for the delivery
                    person. Thank you for your cooperation
                </p>
            </CollapseRadio> */}
        </RadioGroup>
    );
}
function UnSupportedPaythodMethod() {
    return (
        <Card className="relative w-full flex-center ">
            <div className="flex-center flex-col ">
                <BanknotesIcon className="w-16 h-14  " />

                <p>This store can’t accept payments right now.</p>
            </div>
        </Card>
    );
}
