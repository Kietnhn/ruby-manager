"use client";
import {
    FullVariationNoId,
    GroupedProperties,
    Select as TypeSect,
} from "@/lib/definitions";
import { groupPropertiesByName, splitAndTrimString } from "@/lib/utils";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
    Button,
    CheckboxGroup,
    Input,
    Select,
    SelectItem,
    Tooltip,
} from "@nextui-org/react";
import { Property } from "@prisma/client";
import clsx from "clsx";
import React, { useMemo, useState } from "react";

const Properties = ({
    properties,
    currentProperties,
}: {
    properties: Property[];
    currentProperties?: Property[];
}) => {
    const groupedProperties = useMemo(
        () => groupPropertiesByName(properties),
        []
    );
    const [selects, setSelects] = useState<TypeSect[]>(() => {
        // init values
        if (currentProperties && currentProperties.length > 0) {
            const groups = groupPropertiesByName(currentProperties);
            const result: TypeSect[] = groups.map((group, index) => ({
                id: index,
                values: group.values.map((value) => value.id),
                option: group.name,
            }));
            console.log(result);

            return result;
        }
        return [{ id: 0, values: [], option: groupedProperties[0].name }];
    });

    const handleAddSelect = () => {
        const newSelects = [...selects];
        const existedOptions = selects.map((select) => select.option);
        const newOptions = groupedProperties.find(
            (group) => !existedOptions.includes(group.name)
        );
        if (!newOptions) return;
        newSelects.push({
            id: selects.length,
            values: [],
            option: newOptions.name,
        });
        setSelects(newSelects);
    };
    const handleSelectOption = (
        id: number,
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const selected = event.target.value;
        const newSelects = selects.map((select) =>
            select.id === id
                ? { ...select, option: selected, values: [] }
                : select
        );
        setSelects(newSelects);
    };

    const handleDeleteSelect = (id: number) => {
        const deleted = selects.filter((select) => select.id !== id);
        const reIndex = deleted.map((select, index) => ({
            ...select,
            id: index,
        }));

        setSelects(reIndex);
    };
    const handleSelectProperty = (
        id: number,
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const selected = event.target.value;

        const values = splitAndTrimString(selected, ",");
        const newSelects = selects.map((select) =>
            select.id === id ? { ...select, values: values } : select
        );
        setSelects(newSelects);
    };

    const renderSelectValue = (select: TypeSect) => {
        const currentGroup = groupedProperties.find(
            (group) => group.name === select.option
        );
        if (!currentGroup) return;
        const valuesOfOption = currentGroup.values;
        return (
            <Select
                variant="bordered"
                labelPlacement="inside"
                label={select.option}
                placeholder="Select an option"
                classNames={{ label: "capitalize" }}
                onChange={(e) => handleSelectProperty(select.id, e)}
                defaultSelectedKeys={select.values}
                selectionMode="multiple"
            >
                {valuesOfOption.map((property, index) => (
                    <SelectItem
                        key={property.id}
                        value={property.id}
                        className="capitalize"
                    >
                        {property.value}
                    </SelectItem>
                ))}
            </Select>
        );
    };
    const selectedKeys = selects.flatMap((select) => select.values);

    return (
        <>
            <div className="">
                {selects.map((select, index) => (
                    <div
                        className={clsx(
                            "flex gap-4  relative group items-center ",
                            {
                                "mb-4": index !== selects.length - 1,
                            }
                        )}
                        key={index}
                    >
                        <div className="w-1/3 ">
                            <Select
                                variant="bordered"
                                labelPlacement="inside"
                                label={"Property"}
                                classNames={{
                                    label: "capitalize",
                                    value: "capitalize",
                                }}
                                placeholder="Select an property"
                                onChange={(e) =>
                                    handleSelectOption(select.id, e)
                                }
                                defaultSelectedKeys={[select.option]}
                                disabledKeys={selects.map(
                                    (select) => select.option
                                )}
                            >
                                {groupedProperties.map((group) => (
                                    <SelectItem
                                        key={group.name}
                                        value={group.name}
                                        className="capitalize"
                                    >
                                        {group.name}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                        <div className="flex-1 duration-200">
                            {renderSelectValue(select)}
                        </div>
                        {select.values.length > 0 && (
                            <div className="hidden group-hover:block duration-200">
                                <Tooltip content={`Remove ${select.option}`}>
                                    <Button
                                        isIconOnly
                                        onClick={() =>
                                            handleDeleteSelect(select.id)
                                        }
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </Button>
                                </Tooltip>
                            </div>
                        )}
                    </div>
                ))}

                <Select
                    name="propertyIds"
                    id="propertyIds"
                    variant="bordered"
                    labelPlacement="inside"
                    label={"Selected"}
                    classNames={{
                        label: "capitalize",
                        value: "capitalize",
                        mainWrapper: "hidden",
                    }}
                    selectedKeys={selectedKeys}
                    selectionMode="multiple"
                >
                    {properties.map((option, index) => (
                        <SelectItem key={option.id} value={option.id}>
                            {option.value}
                        </SelectItem>
                    ))}
                </Select>
                {selects.length <= groupedProperties.length - 1 && (
                    <Button
                        variant="light"
                        color="primary"
                        onClick={handleAddSelect}
                    >
                        <PlusIcon className="w-5 h-5" /> Add another property
                    </Button>
                )}
            </div>
        </>
    );
};

export default Properties;
