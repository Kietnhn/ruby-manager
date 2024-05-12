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
    TrashIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { Page } from "@prisma/client";
import {
    convertDateToCalendarDate,
    groupPages,
    toDateInputValue,
} from "@/lib/utils";
import clsx from "clsx";
import PageEditor from "@/components/PageEditor";
import { deletePage, editPage } from "@/lib/actions/page";
import { PageContainParent } from "@/lib/definitions";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@nextui-org/react";
import { ConfirmDelete, DeletePage } from "../buttons";
import DefaultInput from "../ui/default-input";
import DefaultTextArea from "../ui/default-textarea";
import CardWrapper from "../ui/card-wrapper";
import DefaultSelect from "../ui/default-select";
import DefaultDatePicker from "../ui/default-date-picker";

const EditPageForm = ({
    pages,
    currentPage,
}: {
    pages: Page[];
    currentPage: PageContainParent;
}) => {
    const groupedPages = groupPages(pages);
    const [body, setBody] = useState<string>(currentPage.body);
    const [isShowSetting, setIsShowSetting] = useState<boolean>(true);

    const initialState = { message: null, errors: {} };
    const editPageWithPageId = editPage.bind(null, currentPage.id);
    // @ts-ignore
    const [state, dispatch] = useFormState(editPageWithPageId, initialState);
    const handleContentChange = (value: string) => {
        setBody(value);
    };
    const deletePageWithId = deletePage.bind(null, currentPage.id);
    return (
        <div className="flex flex-col gap-4">
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
                        <EditButton />
                    </div>
                    <Tooltip
                        content={`${isShowSetting ? "Hide" : "Show"} setting`}
                    >
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
                        heading="Edit page form"
                        className="flex-1 duration-75"
                        classNames={{ body: "flex flex-col gap-4" }}
                    >
                        <DefaultInput
                            name="title"
                            size="lg"
                            errorMessage={state?.errors?.title?.at(0)}
                            defaultValue={currentPage.title}
                        />

                        <div className=" ">
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
                                height="min-h-72 max-h-80 overflow-auto"
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
                            defaultValue={currentPage.handle}
                        />
                        <DefaultTextArea
                            name="description"
                            label="Description (Optional)"
                            rows={2}
                            defaultValue={currentPage.description || ""}
                        />
                        <DefaultSelect
                            name="visibility"
                            errorMessage={state?.errors?.visibility?.at(0)}
                            defaultSelectedKeys={[currentPage.visibility]}
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
                            defaultValue={
                                currentPage.public
                                    ? convertDateToCalendarDate(
                                          currentPage.public
                                      )
                                    : undefined
                            }
                        />
                        <DefaultSelect
                            name="parentId"
                            errorMessage={state?.errors?.parentId?.at(0)}
                            placeholder="Select parent page"
                            defaultSelectedKeys={
                                currentPage.parentId
                                    ? currentPage.parentId
                                    : undefined
                            }
                        >
                            {Object.keys(groupedPages).map(
                                (parentId, index) => (
                                    <SelectSection
                                        key={index}
                                        title={
                                            parentId !== "null"
                                                ? pages.find(
                                                      (c) => c.id === parentId
                                                  )?.handle
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
                                )
                            )}
                        </DefaultSelect>
                    </CardWrapper>
                </div>
            </form>
            <div>
                <ConfirmDelete
                    name="page"
                    isShowTitle
                    action={deletePageWithId}
                />
            </div>
        </div>
    );
};
function EditButton() {
    const { pending } = useFormStatus();
    return (
        <Button
            className="w-full"
            color="primary"
            type="submit"
            isDisabled={pending}
        >
            <ArrowUpOnSquareIcon className="w-5 h-5" />
            Edit
        </Button>
    );
}
export default EditPageForm;
