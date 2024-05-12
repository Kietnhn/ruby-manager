"use client";
import { editMeasurement } from "@/lib/actions/category";
import { PencilIcon } from "@heroicons/react/24/outline";
import { Button, Input, Textarea } from "@nextui-org/react";
import { Measurement } from "@prisma/client";
import React from "react";
import { useFormState, useFormStatus } from "react-dom";
import CardWrapper from "../ui/card-wrapper";
import DefaultInput from "../ui/default-input";
import DefaultTextArea from "../ui/default-textarea";

const EditForm = ({
    currentMeasurement,
}: {
    currentMeasurement: Measurement;
}) => {
    const initialState = { message: null, errors: {} };

    const EditMeasurementWithId = editMeasurement.bind(
        null,
        currentMeasurement.id
    );
    // @ts-ignore
    const [state, dispatch] = useFormState(EditMeasurementWithId, initialState);
    return (
        <form action={dispatch}>
            <CardWrapper
                heading="Edit measurement form"
                className="xl:w-1/3 mx-auto"
                classNames={{ body: "flex flex-col gap-4" }}
            >
                <DefaultInput
                    name="name"
                    errorMessage={state?.errors?.name?.at(0)}
                    defaultValue={currentMeasurement.name}
                />
                <DefaultTextArea
                    name="description"
                    errorMessage={state?.errors?.description?.at(0)}
                    defaultValue={currentMeasurement.description || ""}
                />
                <DefaultTextArea
                    name="sizes"
                    description="Add '|' between value of sizes "
                    errorMessage={state?.errors?.sizes?.at(0)}
                    defaultValue={currentMeasurement.sizes.join(" | ")}
                />
                {state?.message && (
                    <p className="mt-2 text-red-500">{state.message}</p>
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
            <PencilIcon className="w-5 h-5" /> Edit
        </Button>
    );
}
export default EditForm;
