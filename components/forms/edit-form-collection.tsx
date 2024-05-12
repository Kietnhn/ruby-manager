"use client";

import {
    CollectionProductVariation,
    FlatProduct,
    FullProduct,
} from "@/lib/definitions";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Image,
    Input,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Textarea,
    Tooltip,
    image,
    useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState, useMemo } from "react";
import Tiptap from "../TipTap";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Image as TypeImage } from "@prisma/client";
import ModalUploadImages from "../products/modal-upload-images";
import { DataTable } from "../data-table";
import { convertToFlatProducts, generateToImagesFromUrls } from "@/lib/utils";
import { columns } from "@/app/dashboard/collections/create/columns";
import { RowSelectionState } from "@tanstack/react-table";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { DeleteCollection } from "@/app/dashboard/collections/delete/page";

const EditFormCollection = ({
    collection,
    products,
}: {
    collection: CollectionProductVariation;
    products: FullProduct[];
}) => {
    const initialState = { message: null, errors: {} };

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
    const [description, setDescription] = useState<string>("");
    const [images, setImages] = useState<TypeImage[]>(
        generateToImagesFromUrls([collection.image])
    );
    const [rowSelection, setRowSelection] = useState<RowSelectionState>(() => {
        console.log("products", collection.products);

        if (collection.products.length > 0) {
            const result: RowSelectionState = {};

            collection.products.forEach((item) => {
                result[item.id] = true;
            });
            return result;
        } else {
            return {};
        }
    });
    const [selectedProduct, setSelectedProduct] = useState<FullProduct[]>(
        collection.products || []
    );
    // const editCollectionWith
    // const [state,dispatch] = useFormState()

    const flatProducts: FlatProduct[] = useMemo(() => {
        return convertToFlatProducts(products);
    }, []);
    // functions

    const handleContentChange = (value: string) => {
        setDescription(value);
    };
    // effects
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
        <div>
            <form
            // action={dispatch}
            >
                <div className="flex gap-4 flex-nowrap mb-4">
                    <Card className="w-1/2">
                        <CardHeader className="h-14">
                            <p>Collection infomation</p>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            <div className="w-full mb-4">
                                <Input
                                    labelPlacement="outside"
                                    variant="bordered"
                                    placeholder="Enter collection name..."
                                    label="Name"
                                    name="name"
                                    id="name"
                                    defaultValue={collection.name}
                                />
                                {/* {state?.errors?.name &&
                                    state?.errors?.name.map((error: string) => (
                                        <p
                                            className="mt-2 text-sm text-red-500"
                                            key={error}
                                        >
                                            {error}
                                        </p>
                                    ))} */}
                            </div>

                            <div className="w-full mb-4">
                                <Input
                                    labelPlacement="outside"
                                    variant="bordered"
                                    placeholder="Enter collection code..."
                                    label="Collection Code"
                                    name="code"
                                    id="code"
                                    defaultValue={collection.code}
                                />
                                {/* {state?.errors?.code &&
                                    state?.errors?.code.map((error: string) => (
                                        <p
                                            className="mt-2 text-sm text-red-500"
                                            key={error}
                                        >
                                            {error}
                                        </p>
                                    ))} */}
                            </div>
                            <div className="w-full flex-1 flex flex-col">
                                <Textarea
                                    name="description"
                                    id="description"
                                    label="Description (Optional)"
                                    labelPlacement="outside"
                                    variant="bordered"
                                    placeholder="Enter your description"
                                    value={description}
                                    defaultValue={collection.description || ""}
                                    classNames={{
                                        inputWrapper: "hidden",
                                    }}
                                />
                                {/* {state?.errors?.description &&
                                    state?.errors?.description.map(
                                        (error: string) => (
                                            <p
                                                className="mt-2 text-sm text-red-500"
                                                key={error}
                                            >
                                                {error}
                                            </p>
                                        )
                                    )} */}
                                <Tiptap
                                    content={collection.description || ""}
                                    onChange={(newContent: string) =>
                                        handleContentChange(newContent)
                                    }
                                    className="flex-1"
                                />
                            </div>
                        </CardBody>
                    </Card>
                    <Card className="w-1/2">
                        <CardHeader className="flex justify-between items-center">
                            <p>Collection image</p>
                            {image.length > 0 && (
                                <Button size="sm" onClick={onOpen}>
                                    <PencilIcon className="w-5 h-5" />
                                    Edit
                                </Button>
                            )}
                        </CardHeader>

                        <Divider />
                        <CardBody>
                            {images.length > 0 ? (
                                <>
                                    <Textarea
                                        name="image"
                                        id="image"
                                        label="image"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        placeholder="Enter your image"
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
                            {/* {state?.errors?.image &&
                                state?.errors?.image.map((error: string) => (
                                    <p
                                        className="mt-2 text-sm text-red-500"
                                        key={error}
                                    >
                                        {error}
                                    </p>
                                ))} */}
                        </CardBody>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardHeader>
                            <p>Products</p>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            <DataTable
                                columns={columns}
                                data={flatProducts}
                                setData={null}
                                enableSelection={true}
                                rowSelection={rowSelection}
                                keyId="id"
                                setRowSelection={setRowSelection}
                            />
                        </CardBody>
                    </Card>
                </div>
            </form>
            <div className="flex justify-end mt-4">
                <div className="w-1/2 flex gap-2">
                    <div className="w-1/2">
                        <Popover
                            isOpen={isOpenDelete}
                            onOpenChange={(open) => setIsOpenDelete(open)}
                            placement="left-start"
                            showArrow
                            backdrop="opaque"
                            classNames={{
                                base: ["before:bg-default-200"],
                                content: [
                                    "py-3 px-4 border border-default-200",
                                    "bg-gradient-to-br from-white to-default-300",
                                    "dark:from-default-100 dark:to-default-50",
                                ],
                            }}
                        >
                            <PopoverTrigger>
                                <Button color="danger" className="w-full">
                                    <TrashIcon className="w-5 h-5" /> Delete
                                    collection
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                {(titleProps) => (
                                    <div className="px-1 py-2 w-full">
                                        <p
                                            className="text-small font-bold text-foreground"
                                            {...titleProps}
                                        >
                                            Confirm delete
                                        </p>
                                        <p>
                                            Are you sure to delete the
                                            collection{" "}
                                            <strong>{collection.name}</strong>
                                        </p>
                                        <div className="w-full flex gap-4 mt-4">
                                            <div className="w-1/2">
                                                <Button
                                                    onClick={() =>
                                                        setIsOpenDelete(false)
                                                    }
                                                    className="w-full"
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                            <div className="w-1/2">
                                                <DeleteCollection
                                                    id={collection.id}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="w-1/2">
                        <EditButton />
                    </div>
                </div>
            </div>
            <ModalUploadImages
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                gallery={images}
                setGallery={setImages}
                selectMode={"single"}
            />
        </div>
    );
};
function EditButton() {
    const { pending } = useFormStatus();
    return (
        <Button
            color="primary"
            type="submit"
            isDisabled={pending}
            className="w-full"
        >
            <PencilIcon className="w-5 h-5" />
            Edit
        </Button>
    );
}
export default EditFormCollection;
