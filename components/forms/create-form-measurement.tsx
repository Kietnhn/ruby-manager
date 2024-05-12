"use client";
import { createMeasurement } from "@/lib/actions/category";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import React from "react";
import { useFormState, useFormStatus } from "react-dom";
import CardWrapper from "../ui/card-wrapper";
import DefaultInput from "../ui/default-input";
import DefaultTextArea from "../ui/default-textarea";

const CreateForm = () => {
    const initialState = { message: null, errors: {} };

    // @ts-ignore
    const [state, dispatch] = useFormState(createMeasurement, initialState);
    return (
        <form action={dispatch} className="mt-4">
            <CardWrapper
                className="xl:w-1/3 xl:mx-auto"
                heading="Create measurement form"
                classNames={{ body: "flex flex-col gap-4" }}
            >
                <DefaultInput
                    name="name"
                    errorMessage={state?.errors?.name?.at(0)}
                />
                <DefaultTextArea
                    name="description"
                    errorMessage={state?.errors?.description?.at(0)}
                />
                <DefaultTextArea
                    name="sizes"
                    description="Add '|' between value of sizes "
                    errorMessage={state?.errors?.sizes?.at(0)}
                />
                {state?.message && (
                    <p className="text-red-500">{state.message}</p>
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
