"use client";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import Gallery from "@/components/products/gallery";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Country, ICategory, VariationNoImages } from "@/lib/definitions";
import { addProduct } from "@/lib/actions/product";
import { useFormState, useFormStatus } from "react-dom";
import {
    Button,
    CircularProgress,
    Input,
    Radio,
    RadioGroup,
    Select,
    SelectItem,
    SelectSection,
    Textarea,
    cn,
    useDisclosure,
} from "@nextui-org/react";
import { convertDiscountTypeToUnit, groupCategories } from "@/lib/utils";
import {
    Brand,
    Collection,
    Discount,
    Measurement,
    Property,
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

const CreateForm = ({
    categories,
    brands,
    // collections,
    // discounts,
    properties,
}: // countries,
{
    categories: ICategory[];
    brands: Brand[];
    // collections: Collection[];
    properties: Property[];
    // discounts: Discount[];
    // countries: Country[];
}) => {
    const initialState = { message: null, errors: {} };
    const groupedCategories = useMemo(() => groupCategories(categories), []);

    // const dispatch = useAppDispatch();

    // states
    const [details, setDetails] = useState<string>("");
    const [summary, setSummary] = useState<string>("");
    // const [variations, setVariations] = useState<VariationNoImages[]>([]);
    // const [tmpMeasurement, setTmpMeasurement] = useState<Measurement | null>(
    //     null
    // );
    // const [productName, setProductName] = useState<string>("");
    // const [categoryName, setCategoryName] = useState<string>(""); //use to check set category yet
    // const [price, setPrice] = useState<number>(0);
    // const [salePrice, setSalePrice] = useState<number>(0);

    // modal
    const { isOpen, onOpen, onClose } = useDisclosure();

    // server actions
    // const addProductWithVariations = addProduct.bind(null, {
    //     variations,
    //     gallery: gallery,
    // });
    // @ts-ignore
    const [state, formDispatch] = useFormState(addProduct, initialState);

    // functions
    // const handleSelectCategory = (e: ChangeEvent<HTMLSelectElement>) => {
    //     const selectedCategoryId = e.target.value;
    //     const category = categories.find((c) => c.id === selectedCategoryId);
    //     dispatch(setIsShowWarning(!category));
    //     if (!category) return;
    //     setCategoryName(category.name);
    //     setTmpMeasurement(category.measurement || null);
    // };
    // const handleSelectDiscount = (e: ChangeEvent<HTMLSelectElement>) => {
    //     const value = e.target.value;
    //     const selectedDiscount = discounts.find(
    //         (discount) => discount.id === value
    //     );
    //     if (!selectedDiscount || selectedDiscount.type === "SHIPPING") return;
    //     if (selectedDiscount.type === "PERCENTAGE") {
    //         const newSalesPrice =
    //             price - (price * selectedDiscount.value) / 100;
    //         setSalePrice(newSalesPrice);
    //     } else {
    //         const newSalesPrice = price - selectedDiscount.value;
    //         setSalePrice(newSalesPrice);
    //     }
    // };
    // const handleValidName = (e: any) => {
    //     const value = e.target.value;
    //     if (!value) {
    //         e.target.focus();
    //     } else {
    //         setProductName(value);
    //     }
    // };
    // effects
    // useEffect(() => {
    //     // innitialize for gallery
    //     dispatch(setGallery([]));
    // }, []);
    return (
        <main>
            <form action={formDispatch}>
                <div className="grid gap-4 grid-cols-5">
                    <div className="col-span-3 flex flex-col gap-4 ">
                        <CardWrapper
                            heading="General infomation"
                            classNames={{ body: "flex flex-col gap-4" }}
                        >
                            {/* Name */}
                            <div className="flex flex-nowrap gap-4">
                                <DefaultInput
                                    name="name"
                                    autoFocus
                                    // onBlur={handleValidName}
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
                                {/* weight */}
                            </div>

                            {/* Description */}
                            <DefaultInput
                                name="description"
                                errorMessage={
                                    state?.errors?.description?.at(0) as string
                                }
                            />

                            {/* Gender & releaseAt */}
                            <div className="flex  gap-4 flex-nowrap">
                                {/* Gender */}
                                <RadioGroup
                                    className="w-1/2"
                                    label="Select available gender"
                                    name="gender"
                                    orientation="horizontal"
                                    defaultValue={"UNISEX"}
                                >
                                    <Radio value="MEN">Men</Radio>
                                    <Radio value="WOMEN">Women</Radio>
                                    <Radio value="UNISEX">Unisex</Radio>
                                </RadioGroup>
                                {/* release */}
                                <DefaultDatePicker
                                    wrapper="w-1/2"
                                    label="Release at"
                                    name="releaseAt"
                                    errorMessage={state?.errors?.releaseAt?.at(
                                        0
                                    )}
                                />
                            </div>

                            {/* Summary */}
                            <Collapse
                                initState={true}
                                title={
                                    <Textarea
                                        name="summary"
                                        id="summary"
                                        minRows={5}
                                        label="Summary (Optional)"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        placeholder="Type summary"
                                        value={summary}
                                        classNames={{
                                            inputWrapper: "hidden",
                                        }}
                                    />
                                }
                            >
                                <Tiptap
                                    content={summary}
                                    onChange={(newContent: string) =>
                                        setSummary(newContent)
                                    }
                                />
                            </Collapse>
                            {/* Details */}
                            <Collapse
                                title={
                                    <Textarea
                                        name="details"
                                        id="details"
                                        minRows={5}
                                        label="Product Details (Optional)"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        placeholder="Enter your details"
                                        value={details}
                                        classNames={{
                                            inputWrapper: "hidden",
                                        }}
                                    />
                                }
                            >
                                <Tiptap
                                    content={details}
                                    onChange={(newContent: string) =>
                                        setDetails(newContent)
                                    }
                                />
                            </Collapse>
                        </CardWrapper>

                        {/* gallery */}
                        {/* {gallery.length > 0 && (
                            <CardWrapper heading="Gallery">
                                <div className="w-full flex flex-col gap-4">
                                    {gallery.map((item, index) => (
                                        <Gallery
                                            key={index}
                                            variationColor={item.color}
                                        />
                                    ))}
                                </div>
                            </CardWrapper>
                        )} */}
                    </div>
                    <div className="col-span-2 flex flex-col gap-4 ">
                        {/* Pricing*/}
                        {/* <CardWrapper
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
                        </CardWrapper> */}

                        {/* organization */}
                        <CardWrapper
                            heading="Organization"
                            classNames={{ body: "flex flex-col gap-4" }}
                        >
                            {/* Brand */}
                            <Select
                                name="brandId"
                                id="brandId"
                                variant="bordered"
                                labelPlacement="outside"
                                label="Brand"
                                placeholder="Select a brand"
                                classNames={{
                                    value: "capitalize",
                                }}
                            >
                                {brands.map((brand) => (
                                    <SelectItem
                                        key={brand.id}
                                        value={brand.id}
                                        className="capitalize"
                                    >
                                        {brand.name}
                                    </SelectItem>
                                ))}
                            </Select>
                            {/* category */}
                            <DefaultSelect
                                name="categoryId"
                                placeholder="Select a category"
                                label="Category"
                                errorMessage={state?.errors?.categoryId?.at(0)}
                            >
                                {Object.keys(groupedCategories).map(
                                    (parentId, index) => {
                                        if (parentId === "null")
                                            return (
                                                <SelectItem
                                                    className="hidden"
                                                    key={"No parent"}
                                                ></SelectItem>
                                            );
                                        return (
                                            <SelectSection
                                                key={index}
                                                title={
                                                    parentId !== "null"
                                                        ? categories.find(
                                                              (c) =>
                                                                  c.id ===
                                                                  parentId
                                                          )?.name
                                                        : "No Parent"
                                                }
                                            >
                                                {groupedCategories[
                                                    parentId
                                                ].map((category) => (
                                                    <SelectItem
                                                        key={category.id}
                                                        value={category.id}
                                                        className="capitalize"
                                                    >
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectSection>
                                        );
                                    }
                                )}
                            </DefaultSelect>
                            {/* Collection */}
                            {/* <Select
                                name="collectionIds"
                                id="collectionIds"
                                variant="bordered"
                                labelPlacement="outside"
                                label="Collections"
                                placeholder="Select collections"
                                classNames={{
                                    value: "capitalize",
                                }}
                                selectionMode="multiple"
                            >
                                {collections.map((collection) => (
                                    <SelectItem
                                        key={collection.id}
                                        value={collection.id}
                                        className="capitalize"
                                    >
                                        {collection.name}
                                    </SelectItem>
                                ))}
                            </Select> */}
                            {/* </div> */}
                        </CardWrapper>
                        {/* properties*/}
                        <CardWrapper heading="Properties">
                            <Properties properties={properties} />
                        </CardWrapper>
                        {/* Attributes */}

                        {/* <CardWrapper
                            className=" w-full !overflow-visible"
                            classNames={{
                                body: " w-full !overflow-visible",
                            }}
                            heading="Variation Attributes"
                        >
                            <Variants
                                productName={productName}
                                categoryName={categoryName}
                                variations={variations}
                                setVariations={setVariations}
                                measurement={tmpMeasurement}
                            />
                        </CardWrapper> */}
                        {/* isAvailable */}
                        {/* <CardWrapper classNames={{ body: "p-0" }}>
                            <CustomSwitch name="isAvailable">
                                <div className="flex flex-col gap-1">
                                    <p className="text-medium">Availability</p>
                                    <p className="text-tiny text-default-400">
                                        Product available for sale
                                    </p>
                                </div>
                            </CustomSwitch>
                        </CardWrapper> */}

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
                    {/* {variations.length > 0 && (
                        <div className="col-span-5">
                            <CardWrapper
                                heading="Variations"
                                className="w-full"
                            >
                                <DataTable
                                    columns={columns}
                                    data={variations}
                                    setData={setVariations}
                                />
                            </CardWrapper>
                        </div>
                    )} */}
                </div>
            </form>
        </main>
    );
};
export default CreateForm;

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
