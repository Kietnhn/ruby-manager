"use client";
import { createProperty, editProperty } from "@/lib/actions/product";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button, Input, Textarea } from "@nextui-org/react";
import { Property } from "@prisma/client";
import React from "react";
import { useFormState, useFormStatus } from "react-dom";
import CardWrapper from "../ui/card-wrapper";
import DefaultInput from "../ui/default-input";
import DefaultTextArea from "../ui/default-textarea";

const EditForm = ({ currentProperty }: { currentProperty: Property }) => {
    const initialState = { message: null, errors: {} };
    const editPropertyWithId = editProperty.bind(null, currentProperty.id);
    // @ts-ignore
    const [state, dispatch] = useFormState(editPropertyWithId, initialState);
    return (
        <form action={dispatch}>
            <CardWrapper
                className="xl:w-1/3 mx-auto"
                heading="Edit property form"
                classNames={{ body: "flex flex-col gap-4" }}
            >
                <DefaultInput
                    name="name"
                    defaultValue={currentProperty.name}
                    errorMessage={state?.errors?.name?.at(0)}
                />

                <DefaultTextArea
                    name="values"
                    label="Values"
                    errorMessage={state?.errors?.values?.at(0)}
                    description="Use '|' to quickly add multiple values in a single property name."
                    defaultValue={currentProperty.value}
                />

                {state?.message && (
                    <p className=" text-sm text-red-500">{state.message}</p>
                )}
                <EditButton />
            </CardWrapper>
        </form>
    );
};
function EditButton() {
    const { pending } = useFormStatus();
    return (
        <Button isDisabled={pending} color="primary" type="submit">
            <PlusIcon className="w-5 h-5" /> Edit
        </Button>
    );
}
export default EditForm;
