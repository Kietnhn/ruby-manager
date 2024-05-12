"use client";
import { createProperty } from "@/lib/actions/product";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button, Input, Textarea } from "@nextui-org/react";
import React from "react";
import { useFormState, useFormStatus } from "react-dom";
import CardWrapper from "../ui/card-wrapper";
import DefaultInput from "../ui/default-input";
import DefaultTextArea from "../ui/default-textarea";

const CreateForm = () => {
    const initialState = { message: null, errors: {} };
    // @ts-ignore

    const [state, dispatch] = useFormState(createProperty, initialState);
    return (
        <form action={dispatch}>
            <CardWrapper
                className="xl:w-1/3 mx-auto"
                heading="Create property form"
                classNames={{ body: "flex flex-col gap-4" }}
            >
                <DefaultInput
                    name="name"
                    errorMessage={state?.errors?.name?.at(0)}
                />

                <DefaultTextArea
                    name="values"
                    label="Values"
                    errorMessage={state?.errors?.values?.at(0)}
                    description="Use '|' to quickly add multiple values in a single property name."
                />

                {state?.message && (
                    <p className=" text-sm text-red-500">{state.message}</p>
                )}
                <CreateButton />
            </CardWrapper>
        </form>
    );
};
function CreateButton() {
    const { pending } = useFormStatus();
    return (
        <Button isDisabled={pending} color="primary" type="submit">
            <PlusIcon className="w-5 h-5" /> Add
        </Button>
    );
}
export default CreateForm;
