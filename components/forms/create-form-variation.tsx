"use client";
import { CurrencyDollarIcon, PlusIcon } from "@heroicons/react/24/outline";
import Gallery from "@/components/products/gallery";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import {
    Country,
    ICategory,
    ISelectColorsData,
    VariationNoImages,
} from "@/lib/definitions";
import { addProduct } from "@/lib/actions/product";
import { useFormState, useFormStatus } from "react-dom";
import {
    Button,
    Card,
    CircularProgress,
    Image,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    Radio,
    RadioGroup,
    Select,
    SelectItem,
    SelectSection,
    Textarea,
    cn,
    useDisclosure,
} from "@nextui-org/react";
import {
    convertDiscountTypeToUnit,
    groupCategories,
    selectColorsData,
} from "@/lib/utils";
import {
    Brand,
    Collection,
    Discount,
    Measurement,
    Property,
    Size,
    Image as TypeImage,
} from "@prisma/client";
import Variants from "../products/variants";
import Tiptap from "@/components/TipTap";
import Properties from "@/components/products/properties";
import Collapse from "@/components/collapse";
import { columns } from "@/app/dashboard/products/create/columns";
import { DataTable } from "@/components/data-table";
import DefaultInput from "@/components/ui/default-input";
import CardWrapper from "@/components/ui/card-wrapper";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { setGallery, setIsShowWarning } from "@/features/product-slice";
import NotSetCategoryModal from "@/components/modals/not-set-category-modal";
import CustomSwitch from "@/components/ui/custom-switch";

import DefaultDatePicker from "../ui/default-date-picker";
import DefaultSelect from "../ui/default-select";
import { IProductCategory } from "@/lib/definitions/product";
import StoreImages from "../store-images";
import { Reorder } from "framer-motion";
import CustomSelectSize from "../ui/custom-select-colors";
import { MultiValue } from "react-select";
const CreateFormVariation = ({
    product,
    discounts,
}: {
    product: IProductCategory;
    discounts: Discount[];
}) => {
    const initialState = { message: null, errors: {} };

    // const dispatch = useAppDispatch();

    // states
    const [price, setPrice] = useState<number>(0);
    const [salePrice, setSalePrice] = useState<number>(0);
    const [images, setImages] = useState<string[]>([]);
    const [selectedColor, setSelectedColor] = useState<string>("");
    const [sizesData, setSizesData] = useState<Size[]>(() => {
        if (!product.category?.measurement) {
            return [];
        }
        if (product.category?.measurement?.sizes.length > 0) {
            const data: Size[] = product.category?.measurement?.sizes.map(
                (size) => ({ size: size, stock: 0 })
            );
            return data;
        } else {
            const noSizeData = [{ size: "No size", stock: 0 }];
            return noSizeData;
        }
    });
    // modal
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    // server actions
    // const addProductWithVariations = addProduct.bind(null, {
    //     variations,
    //     gallery: gallery,
    // });
    // @ts-ignore
    const [state, formDispatch] = useFormState(addProduct, initialState);
    const options = useMemo(() => selectColorsData(), []);

    // functions
    const handleSelectedImagesChange = (images: TypeImage[]) => {
        if (images.length <= 0) return;
        console.log(images);
        const imageUrls = images.map((image) => image.url);
        setImages(imageUrls);
    };
    const handleSelectDiscount = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const selectedDiscount = discounts.find(
            (discount) => discount.id === value
        );
        if (!selectedDiscount || selectedDiscount.type === "SHIPPING") return;
        if (selectedDiscount.type === "PERCENTAGE") {
            const newSalesPrice =
                price - (price * selectedDiscount.value) / 100;
            setSalePrice(newSalesPrice);
        } else {
            const newSalesPrice = price - selectedDiscount.value;
            setSalePrice(newSalesPrice);
        }
    };
    const handleChange = (selectedOptions: any) => {
        const newSelectedColor = Array.isArray(selectedOptions)
            ? selectedOptions
                  .map((value: ISelectColorsData) => value.value)
                  .join("/")
            : selectedOptions;
        setSelectedColor(newSelectedColor);
        // setSelectedValues(
        //     Array.isArray(selectedOptions) ? selectedOptions : []
        // );
    };

    return (
        <main>
            <form action={formDispatch}>
                <div className="grid gap-4 grid-cols-5">
                    <div className="col-span-3 flex flex-col gap-4 ">
                        <CardWrapper heading="General infomation">
                            {/* Name */}
                            <div className="flex flex-nowrap gap-4">
                                <DefaultInput
                                    name="name"
                                    autoFocus
                                    defaultValue={product.name}
                                    errorMessage={
                                        state?.errors?.name?.at(0) as string
                                    }
                                    wrapper="w-1/2"
                                />
                                <DefaultInput
                                    name="sku"
                                    label="SKU"
                                    placeholder="Ex: UOUBUCUCU1234567"
                                    errorMessage={
                                        state?.errors?.sku?.at(0) as string
                                    }
                                    wrapper="w-1/2"
                                />
                            </div>

                            {/* Description */}
                            <DefaultInput
                                name="description"
                                defaultValue={product.description || ""}
                                errorMessage={
                                    state?.errors?.description?.at(0) as string
                                }
                            />
                        </CardWrapper>

                        {/* gallery */}
                        <CardWrapper
                            heading="Images"
                            classNames={{
                                base: " !overflow-visible ",
                                body: " !overflow-visible flex flex-col gap-4",
                            }}
                        >
                            <CustomSelectSize
                                label="Color"
                                name="color"
                                placeholder="red/green/blue"
                                options={options}
                                onChange={handleChange}
                                wrapper="flex flex-col gap-2"
                            />

                            {selectedColor && (
                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-end items-center">
                                        <Button onClick={onOpen}>
                                            <PlusIcon className="w-5 h-5" />
                                            {images.length > 0
                                                ? "Edit Images"
                                                : "Add Iamges"}{" "}
                                        </Button>
                                    </div>
                                    <Reorder.Group
                                        axis="x"
                                        className="w-full grid grid-flow-col auto-cols-[50%] gap-4 lg:auto-cols-[25%] md:auto-cols-[33.33%]"
                                        values={images}
                                        onReorder={setImages}
                                    >
                                        {images.map((image, index) => (
                                            <Card
                                                key={image}
                                                shadow="none"
                                                // isPressable
                                                // onPress={onOpen}
                                            >
                                                <Image
                                                    alt={image}
                                                    src={image}
                                                />
                                            </Card>
                                        ))}
                                    </Reorder.Group>
                                </div>
                            )}
                        </CardWrapper>
                    </div>
                    <div className="col-span-2 flex flex-col gap-4 ">
                        {/* Pricing*/}
                        <CardWrapper
                            heading="Pricing"
                            classNames={{ body: "flex flex-col gap-4" }}
                        >
                            <DefaultInput
                                name="price"
                                type="number"
                                min={0}
                                step="any"
                                startContent={
                                    <CurrencyDollarIcon className="pointer-events-none h-4 w-4  text-gray-500 peer-focus:text-gray-900" />
                                }
                                endContent={
                                    <Button
                                        isDisabled
                                        isIconOnly
                                        variant="light"
                                    >
                                        USD
                                    </Button>
                                }
                                value={price.toString()}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (Number.isNaN(value)) return;
                                    setPrice(+value);
                                }}
                                errorMessage={
                                    // @ts-ignore
                                    state?.errors?.price?.at(0) as string
                                }
                            />
                            <DefaultSelect
                                name="discountId"
                                id="discountId"
                                label="Discount"
                                isDisabled={!price || price === 0}
                                onChange={handleSelectDiscount}
                                description="Enter price before select discount"
                            >
                                {discounts.map((discount) => (
                                    <SelectItem
                                        key={discount.id}
                                        value={discount.id}
                                        textValue={discount.name}
                                        className="capitalize"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex flex-col ">
                                                <strong>{discount.name}</strong>
                                                <p>{discount.description}</p>
                                            </div>
                                            <div className="flex gap-0.5">
                                                <strong>
                                                    {discount.value}
                                                </strong>
                                                <span className="text-default-500">
                                                    {convertDiscountTypeToUnit(
                                                        discount.type
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </SelectItem>
                                ))}
                            </DefaultSelect>
                            <DefaultInput
                                name="salePrice"
                                type="number"
                                min={0}
                                step="any"
                                readOnly
                                isDisabled={price === salePrice}
                                value={
                                    price === salePrice
                                        ? undefined
                                        : salePrice.toString()
                                }
                                startContent={
                                    <CurrencyDollarIcon className="pointer-events-none h-4 w-4  text-gray-500 peer-focus:text-gray-900" />
                                }
                                endContent={
                                    <Button
                                        isDisabled
                                        isIconOnly
                                        variant="light"
                                    >
                                        USD
                                    </Button>
                                }
                            />
                        </CardWrapper>

                        {/* Attributes */}

                        <CardWrapper
                            className=" w-full !overflow-visible"
                            classNames={{
                                body: " w-full !overflow-visible",
                            }}
                            heading="Variation Attributes"
                        >
                            <Variants
                                measurement={product.category?.measurement}
                            />
                        </CardWrapper>
                        {/* isAvailable */}
                        <CardWrapper classNames={{ body: "p-0" }}>
                            <CustomSwitch name="isAvailable">
                                <div className="flex flex-col gap-1">
                                    <p className="text-medium">Availability</p>
                                    <p className="text-tiny text-default-400">
                                        Product available for sale
                                    </p>
                                </div>
                            </CustomSwitch>
                        </CardWrapper>

                        <div className="w-full flex flex-col gap-4">
                            <CreateButton />

                            {state?.message && (
                                <div>
                                    <p className=" text-sm text-red-500">
                                        {state.message}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </form>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="2xl"
                placement="center"
                scrollBehavior={"inside"}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1"></ModalHeader>
                            <ModalBody>
                                <StoreImages
                                    selectMode="multiple"
                                    onSelectedImagesChange={
                                        handleSelectedImagesChange
                                    }
                                />
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </main>
    );
};
export default CreateFormVariation;

function CreateButton() {
    const { pending } = useFormStatus();
    return (
        <Button
            color="primary"
            isDisabled={pending}
            type="submit"
            className="w-full"
        >
            {pending ? <CircularProgress aria-label="Loading..." /> : "Create"}
        </Button>
    );
}
