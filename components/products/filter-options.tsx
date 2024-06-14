"use client";

import { getBrands } from "@/lib/actions/brand";
import { getCategories } from "@/lib/actions/category";
import { getCollections } from "@/lib/actions/collection";
import { ICategory } from "@/lib/definitions";
import {
    Card,
    Checkbox,
    CheckboxGroup,
    CircularProgress,
    DateRangePicker,
    Select,
    SelectItem,
    SelectSection,
    Slider,
} from "@nextui-org/react";
import { Brand, Collection, Property } from "@prisma/client";
import { ChangeEvent, useEffect, useState } from "react";
import CardWrapper from "../ui/card-wrapper";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { groupCategories } from "@/lib/utils";
import { getProperties } from "@/lib/actions/property";
import { groupPropertiesByName } from "@/lib/utils/property";
import Collapse from "../collapse";
import CustomSwitch from "../ui/custom-switch";
import { GENDERS } from "@/lib/constants";

export default function ProductFilterOptions() {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const selectedGender = searchParams.getAll("gender");
    const selectedBrand = searchParams.getAll("brand");
    const selectedCollection = searchParams.getAll("collection");
    const selectedCategory = searchParams.getAll("category");
    const selectedProperty = searchParams.getAll("property");

    const groupedProperties = groupPropertiesByName(properties);
    const groupedCategories = groupCategories(categories);
    function createSearchParams(key: string, values: string[]) {
        const params = new URLSearchParams(searchParams.toString());
        // reset params
        params.delete(key);
        if (values.length > 0) {
            values.forEach((value) => {
                params.append(key, value);
            });
        }
        return params.toString();
    }
    const handleSelectFilter = (key: string, value: string[]) => {
        if (!key) return;
        const paramURL = createSearchParams(key, value);
        router.replace(`${pathname}?${paramURL}`);
    };
    const handleChangeSelect = (
        key: string,
        e: ChangeEvent<HTMLSelectElement>
    ) => {
        const value = e.target.value;
        console.log(value);
        const values = value.split(",").filter((value) => value !== "");
        console.log(values);

        // if (values.length === 0) return;
        handleSelectFilter(key, values);
    };
    useEffect(() => {
        const fetchData = async () => {
            const [categories, brands, collections, properties] =
                await Promise.all([
                    getCategories(),
                    getBrands(),
                    getCollections(),
                    getProperties(),
                ]);
            setCategories(categories as ICategory[]);
            setBrands(brands);
            setCollections(collections);
            setProperties(properties);
            setLoading(false);
        };
        setLoading(true);

        fetchData();
    }, []);
    // render
    if (
        categories.length === 0 &&
        brands.length === 0 &&
        collections.length === 0
    ) {
        // initital state
        return <></>;
    }
    if (loading) {
        return (
            <div className="relative w-full min-h-52">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <CircularProgress aria-label="Loading..." />
                </div>
            </div>
        );
    }
    return (
        <CardWrapper
            className="shadow-sm border-medium border-default-200 "
            classNames={{ body: "grid gap-4 grid-cols-4" }}
            heading="Filter options"
        >
            <CheckboxGroup
                label="Gender"
                classNames={{ label: "text-small text-foreground" }}
                value={selectedGender}
                onChange={(e) => handleSelectFilter("gender", e)}
            >
                {GENDERS.map((gender) => (
                    <Checkbox value={gender} key={gender}>
                        {gender}
                    </Checkbox>
                ))}
            </CheckboxGroup>
            <div className="flex flex-col gap-4">
                <Select
                    variant="bordered"
                    labelPlacement="outside"
                    label="Category"
                    selectionMode="multiple"
                    placeholder="Select categories"
                    onChange={(e) => handleChangeSelect("category", e)}
                    classNames={{
                        value: "capitalize",
                    }}
                    selectedKeys={selectedCategory}
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
                                    key={category.code}
                                    value={category.code}
                                    className="capitalize"
                                >
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectSection>
                    ))}
                </Select>
                <Select
                    label="Brand"
                    variant="bordered"
                    labelPlacement="outside"
                    selectionMode="multiple"
                    placeholder="Select brands"
                    classNames={{
                        value: "capitalize",
                    }}
                    onChange={(e) => handleChangeSelect("brand", e)}
                    selectedKeys={selectedBrand}
                >
                    {brands.map((brand) => (
                        <SelectItem value={brand.code} key={brand.code}>
                            {brand.name}
                        </SelectItem>
                    ))}
                </Select>
                <Select
                    label="Collection"
                    variant="bordered"
                    labelPlacement="outside"
                    selectionMode="multiple"
                    placeholder="Select collections"
                    classNames={{
                        value: "capitalize",
                    }}
                    onChange={(e) => handleChangeSelect("collection", e)}
                    selectedKeys={selectedCollection}
                >
                    {collections.map((collection) => (
                        <SelectItem
                            value={collection.code}
                            key={collection.code}
                        >
                            {collection.name}
                        </SelectItem>
                    ))}
                </Select>
            </div>

            <Select
                variant="bordered"
                labelPlacement="outside"
                label="Property"
                placeholder="Select properties"
                classNames={{
                    value: "capitalize",
                    base: "justify-start",
                }}
                selectionMode="multiple"
                onChange={(e) => handleChangeSelect("property", e)}
                selectedKeys={selectedProperty}
            >
                {groupedProperties.map((group, index) => (
                    <SelectSection key={index} title={group.name}>
                        {group.values.map((property) => (
                            <SelectItem
                                key={property.id}
                                value={property.id}
                                className="capitalize "
                                textValue={property.value}
                            >
                                {property.value}
                            </SelectItem>
                        ))}
                    </SelectSection>
                ))}
            </Select>

            <div className="flex flex-col gap-4">
                <DateRangePicker
                    variant="bordered"
                    label="Release range"
                    labelPlacement="outside"
                    isDisabled
                />
                <Slider
                    // showSteps={true}

                    label="Price range"
                    formatOptions={{
                        style: "currency",
                        currency: "USD",
                    }}
                    size="sm"
                    disableThumbScale={true}
                    step={1}
                    isDisabled

                    // maxValue={maxPrice}
                    // minValue={minPrice}
                    // defaultValue={[minPrice, maxPrice]}
                    // onChangeEnd={handleRangPrice}
                    // className="max-w-md"
                />
                <Card>
                    <CustomSwitch name="onSales" isDisabled>
                        <div className="flex flex-col gap-1">
                            <p className="text-medium">On Sales</p>
                            {/* <p className="text-tiny text-default-400">
                                            Product available for sale
                                        </p> */}
                        </div>
                    </CustomSwitch>
                </Card>
            </div>
        </CardWrapper>
    );
}
