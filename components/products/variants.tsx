"use client";
import {
    ISelectColorsData,
    TGallery,
    VariationNoImages,
} from "@/lib/definitions";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button, CheckboxGroup, Chip, Input, Tooltip } from "@nextui-org/react";
import { Measurement, Variation } from "@prisma/client";
import React, {
    Dispatch,
    SetStateAction,
    useEffect,
    useMemo,
    useState,
} from "react";
import { CustomCheckbox } from "@/components/ui/customCheckbox";
import {
    capitalizeWords,
    generateCombinations,
    getUniqueColors,
    getUniqueSizes,
    isDifferenceArray,
    selectColorsData,
} from "@/lib/utils";
import { CopyCheckIcon, CopyXIcon } from "lucide-react";
import colors from "color-name";
import ReactSelect, { MultiValue } from "react-select";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { addGallery, setGallery } from "@/features/product-slice";
import _ from "lodash";
const customStyles = {
    control: (provided: any, state: any) => ({
        ...provided,
        borderWidth: "2px ",
        borderRadius: "12px",
        borderTopRightRadius: "0",
        borderBottomRightRadius: "0",
        outline: "none",
        boxShadow: "none",
        minHeight: "2.5rem",
        "&:hover": {
            borderColor: "unset",
        },
    }),
    placeholder: (provided: any) => ({
        ...provided,
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
    }),
    input: (provided: any) => ({
        ...provided,
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
    }),
    menu: (provided: any) => ({
        ...provided,
        zIndex: 9999,
    }),
    menuList: (provided: any) => ({
        ...provided,
        padding: "0.5rem ",
        maxHeight: "200px",
        overflowY: "auto",
    }),
    option: (provided: any, state: any) => ({
        ...provided,
        borderRadius: "8px",
        padding: "0.375rem 0.5rem",
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
        backgroundColor:
            state.isSelected &&
            "hsl(var(--nextui-default) / var(--nextui-default-opacity, var(--tw-bg-opacity)))",
        color:
            state.isSelected &&
            "hsl(var(--nextui-default-foreground) / var(--nextui-default-foreground-opacity, var(--tw-text-opacity)))",
        "&:hover": {
            cursor: "pointer",
            color: "hsl(var(--nextui-default-foreground) / var(--nextui-default-foreground-opacity, var(--tw-text-opacity)))",
            backgroundColor:
                "hsl(var(--nextui-default) / var(--nextui-default-opacity, var(--tw-bg-opacity)))",
        },
    }),
    multiValue: (provided: any) => ({
        ...provided,
        textTransform: "capitalize",
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
    }),
    multiValueLabel: (provided: any) => ({
        ...provided,
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
    }),
    multiValueRemove: (provided: any) => ({
        ...provided,
        "&:hover": {
            backgroundColor: "#e2e8f0",
            color: "#718096",
        },
    }),
    clearIndicator: (provided: any) => ({
        ...provided,
        "&:hover": {
            cursor: " pointer",
        },
    }),
    dropdownIndicator: (provided: any) => ({
        ...provided,
        "&:hover": {
            cursor: " pointer",
        },
    }),
};
const Variants = ({
    variations,
    setVariations,
    measurement,
    productName,
    categoryName,
    initialValue,
}: {
    initialValue?: Variation[];
    productName?: string;
    categoryName?: string;
    variations: VariationNoImages[];
    measurement?: Measurement | null;
    setVariations: Dispatch<SetStateAction<VariationNoImages[]>>;
}) => {
    const dispatch = useAppDispatch();
    const { gallery } = useAppSelector((store) => store.product);

    const [selectedColors, setSelectedColors] = useState<string[]>(() => {
        const variationColors = getUniqueColors(variations);
        if (variationColors.length > 0) {
            return variationColors;
        } else {
            return [];
        }
    });
    const [selectedValues, setSelectedValues] = useState<ISelectColorsData[]>(
        []
    );
    const [selectedSizes, setSelectedSizes] = useState<string[]>(() => {
        const variationSizes = getUniqueSizes(variations);
        console.log({ variationSizes });

        if (variationSizes.length > 0) {
            return variationSizes;
        } else {
            return [];
        }
    });
    const options = useMemo(() => selectColorsData(), []);
    //    functions
    const handleChange = (selectedOptions: MultiValue<ISelectColorsData>) => {
        setSelectedValues(
            Array.isArray(selectedOptions) ? selectedOptions : []
        );
    };
    const handleRemoveColor = (Deletecolor: string) => {
        const newSelectedColors = selectedColors.filter(
            (selectedColor) => selectedColor !== Deletecolor
        );
        const newGallery = gallery.filter((item) =>
            newSelectedColors.includes(item.color)
        );
        dispatch(setGallery(newGallery));

        setSelectedColors(newSelectedColors);
    };
    const handleAddColor = () => {
        if (selectedValues.length === 0) return;
        const newSelectedColor = selectedValues.map((value) => value.value);
        const isInValidColorNames = newSelectedColor.find(
            (color) => colors[color as keyof typeof colors] === undefined
        );

        if (isInValidColorNames) {
            console.log("invalid", isInValidColorNames);

            return;
        }
        const newSelectedColors = [
            ...selectedColors,
            newSelectedColor.join("/"),
        ];
        const newGallery: TGallery = {
            color: newSelectedColor.join("/"),
            images: [],
        };
        dispatch(addGallery(newGallery));
        setSelectedColors(newSelectedColors);
        setSelectedValues([]);
    };
    const handleClearAllSizes = () => {
        setSelectedSizes([]);
    };
    const handleSelectAllSizes = () => {
        if (!measurement) return;

        const availableSizes = measurement.sizes.map((size) => size);
        setSelectedSizes(availableSizes);
    };

    const handleSelectSizes = (value: string[]) => {
        if (!measurement) return;
        const availableSizes = measurement.sizes.map((size) => size);
        const selectedSizesMatched = value.filter((size) =>
            availableSizes.includes(size)
        );
        setSelectedSizes(selectedSizesMatched);
    };
    // component
    const OptionComponent = (props: any) => {
        const { data, innerProps, innerRef } = props;
        return (
            <div
                {...innerProps}
                ref={innerRef}
                className={`flex gap-2 justify-between items-center px-2 py-1.5 
                hover:cursor-pointer hover:bg-hover rounded-small
            `}
            >
                <p className="capitalize text-small">{data.label}</p>
                <div
                    className="w-4 h-4 rounded-sm"
                    style={{
                        backgroundColor: `rgb(${data.color.join(",")})`,
                    }}
                ></div>
            </div>
        );
    };

    //   effects
    useEffect(() => {
        if (categoryName) {
            if (!measurement) {
                console.log("set no seize");

                setSelectedSizes(["No size"]);
            } else {
                if (selectedSizes.includes("No size")) {
                    console.log("rest sizes");

                    setSelectedSizes([]);
                }
            }
        }
    }, [measurement, categoryName]);

    useEffect(() => {
        const uniqueColors = getUniqueColors(variations);
        const uniqueSizes = getUniqueSizes(variations);

        //    if doesn't have any different (color or size) between variations and states
        if (
            !isDifferenceArray(uniqueColors, selectedColors) &&
            !isDifferenceArray(uniqueSizes, selectedSizes)
        ) {
            console.log("doesn't have any different ");
            return;
        }
        console.log(" have different ");

        const combinations = generateCombinations(
            selectedColors,
            selectedSizes
        );

        if (initialValue) {
            const newData: VariationNoImages[] = combinations.map((item) => {
                const matchVariation = initialValue.find(
                    (v) => v.color === item.color && v.size === item.size
                );
                if (!matchVariation) {
                    console.log("invalid variation");
                }
                return {
                    name: productName || "",
                    sku: matchVariation?.sku || "",
                    color: item.color as string,
                    description: "",
                    id: matchVariation?.id || "",
                    stock: matchVariation?.stock || 0,
                    size: item.size as string,
                    productId: matchVariation?.productId || "",
                };
            });
            setVariations(newData);

            console.log({ newData });
        } else {
            const newData: VariationNoImages[] = combinations.map((item) => ({
                name: productName || "",
                sku: "",
                color: item.color as string,
                description: "",
                id: "",
                stock: 0,
                size: item.size as string,
                productId: "",
            }));
            setVariations(newData);

            console.log({ newData });
        }
    }, [selectedColors, selectedSizes]);
    return (
        <>
            <div className=" flex flex-col gap-4">
                <div className="flex w-full  flex-col gap-2 ">
                    <div className="flex items-end ">
                        <div className="flex-1">
                            <label
                                htmlFor=""
                                className="text-foreground text-small"
                            >
                                Colors
                            </label>
                            <ReactSelect
                                isMulti
                                name="colors"
                                options={options}
                                className="flex-1 "
                                value={selectedValues}
                                onChange={handleChange}
                                styles={customStyles}
                                classNamePrefix="select"
                                placeholder={"Red/Blue/Green"}
                                components={{
                                    Option: OptionComponent,
                                }}
                            />
                        </div>

                        <div className="mt-6">
                            <Button
                                className="rounded-l-none"
                                color="primary"
                                onClick={handleAddColor}
                            >
                                <PlusIcon className="w-5 h-5" /> Add
                            </Button>
                        </div>
                    </div>
                    {selectedColors.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                            {selectedColors.map((selectedColors) => (
                                <Chip
                                    key={selectedColors}
                                    // className="mb-4"
                                    startContent={
                                        <div className="flex-center gap-1 ml-1">
                                            {selectedColors
                                                .split("/")
                                                .map((color, index) => (
                                                    <span
                                                        key={index}
                                                        className="w-2 h-2 rounded-full"
                                                        style={{
                                                            backgroundColor: `rgb(${colors[
                                                                color as keyof typeof colors
                                                            ]?.join(",")})`,
                                                        }}
                                                    ></span>
                                                ))}
                                        </div>
                                    }
                                    onClose={() =>
                                        handleRemoveColor(selectedColors)
                                    }
                                >
                                    {capitalizeWords(selectedColors)}
                                </Chip>
                            ))}
                        </div>
                    )}
                </div>
                <div className="">
                    {categoryName ? (
                        measurement ? (
                            <div className="w-full relative">
                                <div className="absolute top-0 right-0 z-10">
                                    {selectedSizes.length ===
                                    measurement.sizes.length ? (
                                        <Tooltip showArrow content="Clear all">
                                            <Button
                                                size="sm"
                                                isIconOnly
                                                variant="light"
                                                color="danger"
                                                onClick={handleClearAllSizes}
                                            >
                                                <CopyXIcon className="w-5 h-5" />
                                            </Button>
                                        </Tooltip>
                                    ) : (
                                        <Tooltip showArrow content="Select all">
                                            <Button
                                                size="sm"
                                                isIconOnly
                                                variant="light"
                                                color="primary"
                                                onClick={handleSelectAllSizes}
                                            >
                                                <CopyCheckIcon className="w-5 h-5" />
                                            </Button>
                                        </Tooltip>
                                    )}
                                </div>
                                <CheckboxGroup
                                    name="size"
                                    label="Size"
                                    classNames={{
                                        label: "text-foreground",
                                        wrapper:
                                            "flex-row border-default-200 border-medium px-3 py-2 rounded-medium text-small min-h-unit-10 max-h-28 overflow-y-auto",
                                    }}
                                    onValueChange={handleSelectSizes}
                                    value={selectedSizes}
                                    // defaultValue={selectedSizes}
                                >
                                    {measurement.sizes.map((unit) => (
                                        <CustomCheckbox value={unit} key={unit}>
                                            <span className="text-small">
                                                {unit}
                                            </span>
                                        </CustomCheckbox>
                                    ))}
                                </CheckboxGroup>
                            </div>
                        ) : (
                            <Input
                                label="Size"
                                name="size"
                                variant="bordered"
                                labelPlacement="outside"
                                readOnly
                                value={"No size"}
                                className="text-foreground"
                            />
                        )
                    ) : (
                        <Input
                            label="Size"
                            name="size"
                            variant="bordered"
                            labelPlacement="outside"
                            readOnly
                            value={"Please select category before"}
                            className="text-red-500"
                        />
                    )}
                </div>

                {/* {variations.length > 0 &&
                    getVariationHaveImages(variations) && (
                        <div>
                            <small className="pointer-events-none text-warning-500">
                                (*) Change values of option can change gallery
                            </small>
                        </div>
                    )} */}
            </div>
        </>
    );
};

export default Variants;
