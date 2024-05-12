"use client";
import {
    ExclamationCircleIcon,
    EnvelopeIcon,
    CheckCircleIcon,
    KeyIcon,
    EyeIcon,
    EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { useFormState, useFormStatus } from "react-dom";
import { Button, Input, Link } from "@nextui-org/react";
import { useState } from "react";
import { SendIcon } from "lucide-react";
import { resetPassword } from "@/lib/actions/user";
import clsx from "clsx";
import { newPassword } from "@/lib/actions/reset-password";
import DefaultInput from "../ui/default-input";

export default function NewPasswordForm({ token }: { token: string }) {
    const initialState = { message: null, errors: {}, success: false };

    const newPasswordWithToken = newPassword.bind(null, token);
    // @ts-ignore
    const [state, dispatch] = useFormState(newPasswordWithToken, initialState);
    const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

    return (
        <form action={dispatch} className="">
            <div className="flex-1 rounded-lg flex flex-col gap-4 ">
                <h1 className={`text-center text-2xl font-semibold`}>
                    Enter a new password
                </h1>
                <DefaultInput
                    errorMessage={state?.errors?.password?.at(0)}
                    type={isShowPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    // classNames={{
                    //     inputWrapper: "pr-0",
                    // }}
                    startContent={<KeyIcon className="w-5 h-5" />}
                    endContent={
                        <Button
                            variant="light"
                            isIconOnly
                            type="button"
                            onClick={() => setIsShowPassword(!isShowPassword)}
                        >
                            {isShowPassword ? (
                                <EyeIcon className="w-5 h-5" />
                            ) : (
                                <EyeSlashIcon className="w-5 h-5" />
                            )}
                        </Button>
                    }
                />

                <div className="">
                    <SubmitButton />

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
                <div className=" flex justify-between items-center">
                    <Button
                        as={Link}
                        href="/auth/login-credentials"
                        variant="bordered"
                        className="w-full"
                        size="sm"
                    >
                        Back to login
                    </Button>
                </div>
            </div>
        </form>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            color="primary"
            type="submit"
            isDisabled={pending}
            className="w-full"
            size="sm"
        >
            Reset password
        </Button>
    );
}
