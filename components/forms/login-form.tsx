"use client";
import {
    KeyIcon,
    ExclamationCircleIcon,
    EnvelopeIcon,
    EyeIcon,
    EyeSlashIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { useFormState, useFormStatus } from "react-dom";
import { authenticate } from "@/lib/actions/user";
import { Button, Input, Link } from "@nextui-org/react";
import { useState } from "react";
import clsx from "clsx";
import DefaultInput from "../ui/default-input";

export default function LoginForm() {
    const [state, dispatch] = useFormState(authenticate, undefined);
    const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
    return (
        <form action={dispatch} className="">
            <div className="flex-1 rounded-lg  flex flex-col gap-4 ">
                <h1 className={`  text-2xl font-semibold`}>
                    Log in to continue.
                </h1>
                <DefaultInput
                    errorMessage={state?.errors?.email?.at(0)}
                    name="email"
                    size="lg"
                    startContent={<EnvelopeIcon className="w-5 h-5" />}
                />
                <div className="">
                    <DefaultInput
                        errorMessage={state?.errors?.password?.at(0)}
                        type={isShowPassword ? "text" : "password"}
                        name="password"
                        // classNames={{
                        //     inputWrapper: "pr-0",
                        // }}
                        startContent={<KeyIcon className="w-5 h-5" />}
                        endContent={
                            <Button
                                variant="light"
                                isIconOnly
                                type="button"
                                onClick={() =>
                                    setIsShowPassword(!isShowPassword)
                                }
                            >
                                {isShowPassword ? (
                                    <EyeIcon className="w-5 h-5" />
                                ) : (
                                    <EyeSlashIcon className="w-5 h-5" />
                                )}
                            </Button>
                        }
                    />
                    <Link
                        className="mt-2 text-sm "
                        href="/auth/forgot-password"
                    >
                        Forgot password ?
                    </Link>
                </div>

                <div className="">
                    <LoginButton />
                    {state?.message && (
                        <div
                            className="flex mt-2 items-end space-x-1"
                            aria-live="polite"
                            aria-atomic="true"
                        >
                            <>
                                {state.success ? (
                                    <CheckCircleIcon className="w-5 h-5 text-success-500" />
                                ) : (
                                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                                )}
                                <p
                                    className={clsx("text-sm text-red-500", {
                                        "!text-success-500": state.success,
                                    })}
                                >
                                    {state?.message}
                                </p>
                            </>
                        </div>
                    )}
                </div>

                <div className="">
                    <Link href="/auth/register" className=" hover:underline">
                        Does not have account yet?
                    </Link>
                </div>
                {/* <div className="mt-4">
                    <Link
                        href="/auth/login-credentials/forget-password"
                        className="font-bold hover:underline"
                    >
                        Foreget password ?
                    </Link>
                </div> */}
            </div>
        </form>
    );
}

function LoginButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            color="primary"
            type="submit"
            isDisabled={pending}
            className="w-full"
        >
            Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
    );
}
