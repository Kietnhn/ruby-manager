"use client";

import {
    AtSymbolIcon,
    KeyIcon,
    EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";

import { useFormState, useFormStatus } from "react-dom";
import { register } from "@/lib/actions/user";
import Link from "next/link";
import { Button, Input } from "@nextui-org/react";
import CardWrapper from "../ui/card-wrapper";
import DefaultInput from "../ui/default-input";
// import { RegisterFrom as TypeRegisterForm } from "@/lib/definitions";
// import { ChangeEvent, useState } from "react";

export default function RegisterFrom() {
    const initialState = { message: null, errors: {} };

    // @ts-ignore
    const [state, dispatch] = useFormState(register, initialState);

    return (
        <form action={dispatch} className="space-y-3">
            <CardWrapper heading="Register" className="flex-1 ">
                <div className="w-full flex gap-4 ">
                    <DefaultInput
                        wrapper="w-1/2"
                        label="First Name"
                        name="firstName"
                        errorMessage={state?.errors?.firstName?.at(0)}
                        startContent={<AtSymbolIcon className="w-5 h-5" />}
                    />
                    <DefaultInput
                        wrapper="w-1/2"
                        label="Last Name"
                        name="lastName"
                        errorMessage={state?.errors?.lastName?.at(0)}
                        startContent={<AtSymbolIcon className="w-5 h-5" />}
                    />
                </div>
                <DefaultInput
                    errorMessage={state?.errors?.email?.at(0)}
                    name="email"
                    startContent={<EnvelopeIcon className="w-5 h-5" />}
                />
                <DefaultInput
                    errorMessage={state?.errors?.password?.at(0)}
                    type="password"
                    name="password"
                    startContent={<KeyIcon className="w-5 h-5" />}
                    minLength={6}
                />

                <div className="">
                    <p className=" text-sm text-red-500">{state?.message}</p>
                    <RegisterButton />
                </div>

                <div className="">
                    <p className="">
                        Already have account?{" "}
                        <Link
                            href="/login"
                            className="font-bold hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </CardWrapper>
        </form>
    );
}

function RegisterButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            className="mt-4 w-full"
            isDisabled={pending}
            color="primary"
            type="submit"
        >
            Register <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
    );
}
