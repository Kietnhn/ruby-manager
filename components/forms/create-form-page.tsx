"use client";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Input,
    Select,
    SelectItem,
    SelectSection,
    Textarea,
    Tooltip,
} from "@nextui-org/react";
import React, { useState } from "react";

import { useFormState, useFormStatus } from "react-dom";
import {
    ArrowUpOnSquareIcon,
    Cog6ToothIcon,
    DocumentIcon,
    EyeIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { Page } from "@prisma/client";
import { groupPages, toDateInputValue } from "@/lib/utils";
import clsx from "clsx";
import PageEditor from "@/components/PageEditor";
import { createPage } from "@/lib/actions/page";
import CardWrapper from "../ui/card-wrapper";
import DefaultInput from "../ui/default-input";
import DefaultTextArea from "../ui/default-textarea";
import DefaultSelect from "../ui/default-select";
import DefaultDatePicker from "../ui/default-date-picker";
import { getLocalTimeZone, now, today } from "@internationalized/date";

const CreatePageForm = ({ pages }: { pages: Page[] }) => {
    const groupedPages = groupPages(pages);
    const [body, setBody] = useState<string>("");
    const [isShowSetting, setIsShowSetting] = useState<boolean>(true);
    const handleContentChange = (value: string) => {
        setBody(value);
    };
    const initialState = { message: null, errors: {} };
    // @ts-ignore
    const [state, dispatch] = useFormState(createPage, initialState);

    return (
        <form
            className="w-full h-full relative flex flex-col gap-4"
            action={dispatch}
        >
            {/* tools */}
            <div className="w-full flex justify-end gap-2">
                <Button type="button">
                    <DocumentIcon className="w-5 h-5" /> Save draf
                </Button>
                <Button type="button">
                    <EyeIcon className="w-5 h-5" />
                    View
                </Button>
                <div className="">
                    <CreateButton />
                </div>
                <Tooltip content={`${isShowSetting ? "Hide" : "Show"} setting`}>
                    <Button
                        type="button"
                        isIconOnly
                        onClick={() => setIsShowSetting(!isShowSetting)}
                    >
                        {isShowSetting ? (
                            <XMarkIcon className="w-5 h-5" />
                        ) : (
                            <Cog6ToothIcon className="w-5 h-5" />
                        )}
                    </Button>
                </Tooltip>
            </div>
            <div className="flex justify-end items-start">
                {state?.message && (
                    <p className="mt-2 text-sm text-red-500">
                        {state?.message}
                    </p>
                )}
            </div>
            <div className="flex gap-4">
                <CardWrapper
                    heading="Create page form"
                    className="flex-1 duration-75"
                >
                    <DefaultInput
                        name="title"
                        size="lg"
                        autoFocus
                        errorMessage={state?.errors?.title?.at(0)}
                    />

                    <div className="">
                        <DefaultTextArea
                            name="body"
                            label="Body"
                            errorMessage={state?.errors?.body?.at(0)}
                            value={body}
                            classNames={{
                                inputWrapper: "hidden",
                            }}
                        />

                        <PageEditor
                            height="min-h-72"
                            content={body}
                            onChange={(newContent: string) =>
                                handleContentChange(newContent)
                            }
                        />
                    </div>
                </CardWrapper>
                <CardWrapper
                    heading="Settings"
                    className={clsx("w-1/4 hidden", {
                        "animate-appearance-in block": isShowSetting,
                        "animate-appearance-out ": !isShowSetting,
                    })}
                    classNames={{ body: "flex flex-col gap-4" }}
                >
                    <DefaultInput
                        name="handle"
                        errorMessage={state?.errors?.handle?.at(0)}
                        description="Path name"
                    />

                    <DefaultTextArea
                        name="description"
                        label="Description (Optional)"
                        rows={2}
                    />
                    <DefaultSelect
                        name="visibility"
                        defaultSelectedKeys={["PUBLIC"]}
                        errorMessage={state?.errors?.visibility?.at(0)}
                    >
                        {["PUBLIC", "PRIVATE"].map((status) => (
                            <SelectItem key={status} value={status}>
                                {status}
                            </SelectItem>
                        ))}
                    </DefaultSelect>

                    <DefaultDatePicker
                        name="public"
                        label="Public"
                        errorMessage={state?.errors?.public?.at(0)}
                    />

                    <DefaultSelect
                        name="parentId"
                        errorMessage={state?.errors?.parentId?.at(0)}
                        placeholder="Select parent page"
                    >
                        {Object.keys(groupedPages).map((parentId, index) => (
                            <SelectSection
                                key={index}
                                title={
                                    parentId !== "null"
                                        ? pages.find((c) => c.id === parentId)
                                              ?.handle
                                        : "No Parent"
                                }
                            >
                                {groupedPages[parentId].map((page) => (
                                    <SelectItem
                                        key={page.id}
                                        value={page.id}
                                        className="capitalize"
                                    >
                                        {page.handle}
                                    </SelectItem>
                                ))}
                            </SelectSection>
                        ))}
                    </DefaultSelect>
                </CardWrapper>
            </div>
        </form>
    );
};
function CreateButton() {
    const { pending } = useFormStatus();
    return (
        <Button
            className="w-full"
            color="primary"
            type="submit"
            isDisabled={pending}
        >
            <ArrowUpOnSquareIcon className="w-5 h-5" />
            Create
        </Button>
    );
}
export default CreatePageForm;
