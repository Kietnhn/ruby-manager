"use client";

import { FlatProduct, FullProduct } from "@/lib/definitions";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Image,
    Input,
    Textarea,
    image,
    useDisclosure,
} from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import Tiptap from "../TipTap";
import { PencilIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Image as TypeImage } from "@prisma/client";
import ModalUploadImages from "../products/modal-upload-images";
import { DataTable } from "../data-table";
import { convertToFlatProducts } from "@/lib/utils";
import { columns } from "@/app/dashboard/collections/create/columns";
import { RowSelectionState } from "@tanstack/react-table";
import { createCollection } from "@/lib/actions/collection";
import { useFormState, useFormStatus } from "react-dom";
import CardWrapper from "../ui/card-wrapper";
import DefaultInput from "../ui/default-input";
import DefaultTextArea from "../ui/default-textarea";

const CreateFormCollection = ({ products }: { products: FullProduct[] }) => {
    const initialState = { message: null, errors: {} };

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [description, setDescription] = useState<string>("");
    const [images, setImages] = useState<TypeImage[]>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [selectedProduct, setSelectedProduct] = useState<FullProduct[]>([]);
    const flatProducts: FlatProduct[] = useMemo(() => {
        return convertToFlatProducts(products);
    }, []);

    const handleContentChange = (value: string) => {
        setDescription(value);
    };
    const createCollectionWithSelectedProduct = createCollection.bind(
        null,
        selectedProduct
    );
    // @ts-ignore
    const [state, dispatch] = useFormState(
        createCollectionWithSelectedProduct,
        initialState
    );
    useEffect(() => {
        const arraySelection = Array.from(Object.keys(rowSelection));
        if (arraySelection.length > 0) {
            const productsSelected = products.filter((product) =>
                arraySelection.includes(product.id)
            );
            setSelectedProduct(productsSelected);
        }
    }, [rowSelection]);
    return (
        <>
            <form action={dispatch} className="flex flex-col gap-4">
                <div className="flex justify-end ">
                    <div className="flex flex-col items-end">
                        <CreateButton />
                        {state?.message && (
                            <p className="mt-2 text-sm text-red-500">
                                {state.message}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex gap-4 flex-nowrap ">
                    <CardWrapper
                        className="w-1/2"
                        heading="Collection infomation"
                        classNames={{ body: "flex flex-col gap-4" }}
                    >
                        <DefaultInput
                            name="name"
                            autoFocus
                            errorMessage={state?.errors?.name?.at(0)}
                        />

                        <DefaultInput
                            placeholder="Enter collection code..."
                            label="Collection Code"
                            name="code"
                            maxLength={2}
                            errorMessage={state?.errors?.code?.at(0)}
                        />

                        <div className="w-full flex-1 flex flex-col">
                            <DefaultTextArea
                                name="description"
                                label="Description (Optional)"
                                value={description}
                                classNames={{
                                    inputWrapper: "hidden",
                                }}
                                errorMessage={state?.errors?.description?.at(0)}
                            />

                            <Tiptap
                                content={description}
                                onChange={(newContent: string) =>
                                    handleContentChange(newContent)
                                }
                                className="flex-1"
                            />
                        </div>
                    </CardWrapper>
                    <CardWrapper
                        className="w-1/2"
                        heading="Collection image"
                        classNames={{ body: "flex flex-col gap-4" }}
                    >
                        <div className="flex justify-between items-center">
                            {image.length > 0 && (
                                <Button size="sm" onClick={onOpen}>
                                    <PencilIcon className="w-5 h-5" />
                                    Edit
                                </Button>
                            )}
                        </div>

                        <>
                            {images.length > 0 ? (
                                <>
                                    <DefaultTextArea
                                        name="image"
                                        value={images[0].url}
                                        classNames={{
                                            inputWrapper: "hidden",
                                            label: "hidden",
                                        }}
                                    />
                                    <Card className="w-full h-full flex justify-center items-center">
                                        <Image
                                            classNames={{ wrapper: "h-full" }}
                                            className="w-full h-full object-cover"
                                            src={images[0].url}
                                            alt={images[0].public_id}
                                        />
                                    </Card>
                                </>
                            ) : (
                                <Card
                                    className="w-full h-full flex justify-center items-center "
                                    isPressable
                                    onPress={onOpen}
                                >
                                    <PlusIcon className="w-8 h-8" />
                                </Card>
                            )}
                            {state?.errors?.image &&
                                state?.errors?.image.map((error: string) => (
                                    <p
                                        className="mt-2 text-sm text-red-500"
                                        key={error}
                                    >
                                        {error}
                                    </p>
                                ))}
                        </>
                    </CardWrapper>
                </div>
                <CardWrapper heading="Products">
                    <DataTable
                        columns={columns}
                        data={flatProducts}
                        setData={null}
                        enableSelection={true}
                        rowSelection={rowSelection}
                        keyId="id"
                        setRowSelection={setRowSelection}
                    />
                </CardWrapper>
            </form>
            <ModalUploadImages
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                gallery={images}
                setGallery={setImages}
                selectMode={"single"}
            />
        </>
    );
};
function CreateButton() {
    const { pending } = useFormStatus();
    return (
        <Button color="primary" type="submit" isDisabled={pending}>
            <PlusIcon className="w-5 h-5" />
            Create
        </Button>
    );
}
export default CreateFormCollection;
