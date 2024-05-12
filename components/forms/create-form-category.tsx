"use client";
import { createCategory } from "@/lib/actions/category";
import { ICategory } from "@/lib/definitions";
import { groupCategories, reverseArrayToString } from "@/lib/utils";
import {
    Button,
    Input,
    Select,
    SelectItem,
    SelectSection,
} from "@nextui-org/react";
import { Measurement } from "@prisma/client";
import React, { useCallback } from "react";
import { useFormState, useFormStatus } from "react-dom";
import CardWrapper from "../ui/card-wrapper";
import DefaultInput from "../ui/default-input";
import DefaultSelect from "../ui/default-select";

const CreateForm = ({
    categories,
    measurements,
}: {
    categories: ICategory[];
    measurements: Measurement[];
}) => {
    const initialState = { message: null, errors: {} };

    const [parentId, setParentId] = React.useState<string>("");

    const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setParentId(e.target.value);
    };

    const groupedCategories = groupCategories(categories);
    const relativeParent = useCallback(() => {
        if (parentId) {
            const category = categories.find(
                (category) => category.id === parentId
            );
            const measurement = measurements.find(
                (measurement) => measurement.id === category?.measurement?.id
            );

            return measurement?.id ? [measurement.id] : undefined;
        }
        return undefined;
    }, [parentId]);
    // @ts-ignore
    const [state, dispatch] = useFormState(createCategory, initialState);
    return (
        <form action={dispatch}>
            <CardWrapper
                heading="Create category form"
                className="lg:w-1/3 lg:mx-auto"
                classNames={{ body: "flex gap-4 flex-col" }}
            >
                <DefaultInput name="name" />
                <DefaultInput
                    name="code"
                    description="Code of the category with 2 characters"
                    maxLength={2}
                    errorMessage={state?.errors?.code?.at(0)}
                />

                <DefaultSelect
                    name="parentId"
                    label="Parent Category"
                    placeholder="Select a parent category"
                    selectedKeys={parentId ? [parentId] : undefined}
                    onChange={handleSelectionChange}
                    errorMessage={state?.errors?.parentId?.at(0)}
                >
                    {Object.keys(groupedCategories).map((parentId, index) => (
                        <SelectSection
                            key={index}
                            title={
                                parentId !== "null"
                                    ? categories.find((c) => c.id === parentId)
                                          ?.name
                                    : "No Parent"
                            }
                        >
                            {groupedCategories[parentId].map((category) => (
                                <SelectItem
                                    key={category.id}
                                    value={category.id}
                                    className="capitalize"
                                >
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectSection>
                    ))}
                </DefaultSelect>

                <DefaultSelect
                    name="measurementId"
                    errorMessage={state?.errors?.measurementId?.at(0)}
                    selectedKeys={relativeParent()}
                >
                    {measurements.map((masurement) => (
                        <SelectItem
                            key={masurement.id}
                            value={masurement.id}
                            textValue={masurement.name}
                            className="capitalize"
                        >
                            <div className="flex flex-col">
                                <span className="text-small">
                                    {masurement.name}
                                </span>
                                <span className="text-tiny text-default-400">
                                    {reverseArrayToString(masurement.sizes)}
                                </span>
                            </div>
                        </SelectItem>
                    ))}
                </DefaultSelect>
                {state?.message && (
                    <p className=" text-sm text-red-500">{state?.message}</p>
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
            Create
        </Button>
    );
}

export default CreateForm;
