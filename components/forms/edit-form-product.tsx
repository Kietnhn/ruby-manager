"use client";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import Gallery from "@/components/products/gallery";
import React, {
    ChangeEvent,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    ICategory,
    FullProduct,
    DeepProduct,
    VariationNoImages,
    TGallery,
} from "@/lib/definitions";
import { editProduct } from "@/lib/actions/product";
import { useFormState, useFormStatus } from "react-dom";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Input,
    Link,
    Radio,
    RadioGroup,
    Select,
    SelectItem,
    SelectSection,
    Switch,
    Textarea,
    cn,
    useDisclosure,
} from "@nextui-org/react";

import {
    toCapitalize,
    getVariationsHaveSameColor,
    groupCategories,
    toDateInputValue,
    convertDiscountTypeToUnit,
    getUniqueColors,
} from "@/lib/utils";
import {
    Brand,
    Collection,
    Discount,
    Measurement,
    Property,
    StyleGender,
    Variation,
} from "@prisma/client";
import clsx from "clsx";
import TableVariations from "../tables/table-variations";
import Variants from "../products/variants";
import Tiptap from "../TipTap";
import Properties from "../products/properties";
import Collapse from "../collapse";
import CardWrapper from "../ui/card-wrapper";
import DefaultInput from "../ui/default-input";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import DefaultDatePicker from "../ui/default-date-picker";
import DefaultSelect from "../ui/default-select";
import CustomSwitch from "../ui/custom-switch";
import { DataTable } from "../data-table";
import { columns } from "@/app/dashboard/products/create/columns";
import NotSetCategoryModal from "../modals/not-set-category-modal";
import { setGallery } from "@/features/product-slice";
const EditForm = ({
    categories,
    product,
    brands,
    collections,
    properties,
    discounts,
}: {
    categories: ICategory[];
    product: DeepProduct;
    brands: Brand[];
    collections: Collection[];
    properties: Property[];
    discounts: Discount[];
}) => {
    const initialState = { message: null, errors: {} };
    const groupedCategories = useMemo(() => groupCategories(categories), []);

    // states
    const initVariations = useMemo(() => product.variations, []);
    const { gallery, isShowWarning } = useAppSelector((store) => store.product);
    const [tmpMeasurement, setTmpMeasurement] = useState<Measurement | null>(
        product.category?.measurement as Measurement
    );
    const [productName, setProductName] = useState<string>(product.name);
    const [details, setDetails] = useState<string>(product.details || "");
    const [summary, setSummary] = useState<string>(product.summary || "");
    const [categoryName, setCategoryName] = useState<string>(
        product.category?.name || ""
    );

    const [variations, setVariations] =
        useState<VariationNoImages[]>(initVariations);
    const [price, setPrice] = useState<number>(product.price);
    const [salePrice, setSalePrice] = useState<number>(
        product.salePrice || product.price
    );
    const dispatch = useAppDispatch();
    // modal
    const { isOpen, onOpen, onClose } = useDisclosure();

    const editProductWithData = editProduct.bind(null, {
        productId: product.id,
        variations: variations,
        gallery,
    });
    // @ts-ignore
    const [state, formDispatch] = useFormState(
        editProductWithData,
        initialState
    );

    const handleSelectCategory = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedCategoryId = e.target.value;
        const category = categories.find((c) => c.id === selectedCategoryId);
        setCategoryName(category?.name as string);
        setTmpMeasurement(category?.measurement as Measurement);
    };

    const handleSelectDiscount = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const selectedDiscount = discounts.find(
            (discount) => discount.id === value
        );
        if (!selectedDiscount || selectedDiscount.type === "SHIPPING") {
            setSalePrice(price);

            return;
        }
        if (selectedDiscount.type === "PERCENTAGE") {
            const newSalesPrice =
                price - (price * selectedDiscount.value) / 100;
            setSalePrice(newSalesPrice);
        } else {
            const newSalesPrice = price - selectedDiscount.value;
            setSalePrice(newSalesPrice);
        }
    };
    const handleValidName = (e: any) => {
        const value = e.target.value;
        if (!value) {
            e.target.focus();
        } else {
            setProductName(value);
        }
    };
    // effects
    useEffect(() => {
        console.log("product variations", product.variations);
        console.log("variations", variations);

        const uniqueColors = getUniqueColors(product.variations);
        console.log("uniqueColors", uniqueColors);

        // const initialGallery:TGallery[] = []
        const initialGallery: TGallery[] = uniqueColors.map((color) => {
            const variationMatchColor = product.variations.find(
                (variation) => variation.color === color
            );
            return {
                color: color,
                images: variationMatchColor?.images as string[],
            };
        });
        console.log("initialGallery", initialGallery);

        // innitialize for gallery
        dispatch(setGallery(initialGallery));
    }, []);

    return (
        <main>
            <form action={formDispatch} className="">
                <div className="flex  gap-4 ">
                    <div className="w-3/5 mb-4">
                        <div className="w-full flex flex-col gap-4">
                            <CardWrapper heading="General infomation">
                                <div className="flex flex-col gap-4">
                                    {/* Name */}
                                    <DefaultInput
                                        name="name"
                                        size="lg"
                                        defaultValue={product.name}
                                        errorMessage={state.errors.name?.at(0)}
                                        onBlur={handleValidName}
                                    />

                                    {/* Description */}
                                    <DefaultInput
                                        name="description"
                                        errorMessage={
                                            state?.errors?.description?.at(
                                                0
                                            ) as string
                                        }
                                        defaultValue={product.description || ""}
                                    />

                                    {/*sku &  weight */}
                                    <div className="flex gap-4 flex-nowrap">
                                        <div className="w-1/2 ">
                                            <DefaultInput
                                                name="sku"
                                                label="SKU"
                                                defaultValue={product.sku}
                                                placeholder="Ex: UOUBUCUCU1234567"
                                                errorMessage={state.errors.sku?.at(
                                                    0
                                                )}
                                            />
                                        </div>
                                        <div className="w-1/2 ">
                                            <DefaultInput
                                                description="Used to calculate shipping rates at checkout and label prices during fulfillment."
                                                name="weight"
                                                type="number"
                                                endContent={
                                                    <Button
                                                        isDisabled
                                                        isIconOnly
                                                        variant="light"
                                                    >
                                                        kg
                                                    </Button>
                                                }
                                                defaultValue={product.weight.toString()}
                                                errorMessage={state.errors.weight?.at(
                                                    0
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* Gender & releaseAt */}
                                    <div className="flex  gap-4 flex-nowrap">
                                        {/* Gender */}

                                        <RadioGroup
                                            className="w-1/2"
                                            label="Style gender"
                                            name="gender"
                                            orientation="horizontal"
                                            defaultValue={product.gender}
                                            classNames={{
                                                label: "text-sm text-foreground",
                                            }}
                                        >
                                            <Radio value="MEN">Men</Radio>
                                            <Radio value="WOMEN">Women</Radio>
                                            <Radio value="UNISEX">Unisex</Radio>
                                        </RadioGroup>
                                        {/* release at */}
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
                                </div>
                            </CardWrapper>
                            {/* gallery */}
                            {gallery.length > 0 && (
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
                            )}
                            {/* properties*/}
                            <CardWrapper heading="Properties">
                                <Properties
                                    properties={properties}
                                    currentProperties={product.properties}
                                />
                            </CardWrapper>
                        </div>
                    </div>
                    <div className="w-2/5 mb-4">
                        <div className="flex flex-col gap-4">
                            {/* Pricing*/}
                            <CardWrapper heading="Pricing">
                                <div className="flex flex-col gap-4">
                                    <DefaultInput
                                        name="price"
                                        type="number"
                                        label="Base price"
                                        placeholder="0.00"
                                        value={price.toString()}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (Number.isNaN(value)) return;
                                            setPrice(+value);
                                        }}
                                        startContent={
                                            <CurrencyDollarIcon className="pointer-events-none h-[18px] w-[18px]  text-gray-500 peer-focus:text-gray-900" />
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
                                        errorMessage={state.errors.price?.at(0)}
                                    />

                                    <DefaultSelect
                                        name="discountId"
                                        id="discountId"
                                        label="Discount"
                                        isDisabled={!price || price === 0}
                                        onChange={handleSelectDiscount}
                                        description="Enter price before select discount"
                                        selectionMode="single"
                                        defaultSelectedKeys={
                                            product.discountId
                                                ? [product.discountId]
                                                : undefined
                                        }
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
                                                        <strong>
                                                            {discount.name}
                                                        </strong>
                                                        <p>
                                                            {
                                                                discount.description
                                                            }
                                                        </p>
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
                                        startContent={
                                            <CurrencyDollarIcon className="pointer-events-none h-4 w-4  text-gray-500 peer-focus:text-gray-900" />
                                        }
                                        readOnly
                                        isDisabled={price === salePrice}
                                        value={
                                            price === salePrice
                                                ? undefined
                                                : salePrice.toString()
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
                                        errorMessage={
                                            state?.errors?.price?.at(
                                                0
                                            ) as string
                                        }
                                    />
                                </div>
                            </CardWrapper>
                            {/* Organization*/}
                            <CardWrapper heading="Organization">
                                <div className="flex flex-col gap-4">
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
                                        defaultSelectedKeys={
                                            product.brandId
                                                ? [product.brandId]
                                                : undefined
                                        }
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
                                    <Select
                                        name="categoryId"
                                        id="categoryId"
                                        variant="bordered"
                                        labelPlacement="outside"
                                        label="Category"
                                        placeholder="Select a category"
                                        defaultSelectedKeys={
                                            product.categoryId
                                                ? [product.categoryId]
                                                : undefined
                                        }
                                        errorMessage={state.errors.categoryId?.at(
                                            0
                                        )}
                                        onChange={handleSelectCategory}
                                    >
                                        {Object.keys(groupedCategories).map(
                                            (parentId, index) => (
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
                                            )
                                        )}
                                    </Select>
                                    {/* Collection */}
                                    <Select
                                        name="collectionIds"
                                        id="collectionIds"
                                        variant="bordered"
                                        labelPlacement="outside"
                                        label="Collection"
                                        placeholder="Select collections"
                                        classNames={{
                                            value: "capitalize",
                                        }}
                                        defaultSelectedKeys={
                                            product.collectionIds.length > 0
                                                ? product.collectionIds
                                                : undefined
                                        }
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
                                    </Select>
                                </div>
                            </CardWrapper>
                            {/* Variation Attributes */}

                            <CardWrapper
                                className=" w-full !overflow-visible"
                                classNames={{
                                    body: " w-full !overflow-visible",
                                }}
                                heading="Variation Attributes"
                            >
                                <Variants
                                    initialValue={initVariations}
                                    productName={productName}
                                    categoryName={categoryName}
                                    variations={variations}
                                    setVariations={setVariations}
                                    measurement={tmpMeasurement}
                                />
                            </CardWrapper>

                            {/* isAvailable */}
                            <CardWrapper classNames={{ body: "p-0" }}>
                                <CustomSwitch
                                    name="isAvailable"
                                    defaultSelected={product.isAvailable}
                                >
                                    <div className="flex flex-col gap-1">
                                        <p className="text-medium">
                                            Availability
                                        </p>
                                        <p className="text-tiny text-default-400">
                                            Product available for sale
                                        </p>
                                    </div>
                                </CustomSwitch>
                            </CardWrapper>
                            {state?.message && (
                                <p className="mb-4 text-sm text-red-500">
                                    {state.message}
                                </p>
                            )}
                            <div className="flex gap-4">
                                <div className="w-full">
                                    {!categoryName && isShowWarning ? (
                                        <Button
                                            color="primary"
                                            type="button"
                                            className="w-full"
                                            onClick={onOpen}
                                        >
                                            Edit
                                        </Button>
                                    ) : (
                                        <EditButton />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {variations.length > 0 && (
                    <div className="w-full">
                        <CardWrapper heading="Variations" className="w-full">
                            <DataTable
                                columns={columns}
                                data={variations}
                                setData={setVariations}
                            />
                        </CardWrapper>
                    </div>
                )}
                {/* <div>
                    <p>Edit Variations ?
                    <Link href={`/dashboard/products/${product.id}/variations/edit`}>Click here</Link>
                    To edit variations of this product
                    </p>
                </div> */}
            </form>
            <NotSetCategoryModal isOpen={isOpen} onClose={onClose} />
        </main>
    );
};
export default EditForm;

function EditButton() {
    const { pending } = useFormStatus();
    return (
        <Button
            color="primary"
            isDisabled={pending}
            type="submit"
            className="w-full"
        >
            Edit
        </Button>
    );
}
