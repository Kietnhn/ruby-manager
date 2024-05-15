"use client";
import Loading from "@/app/dashboard/loading";
import { getBrands } from "@/lib/actions/brand";
import { getCategories } from "@/lib/actions/category";
import { getCollections } from "@/lib/actions/collection";
import { ICategory, TypeFilter } from "@/lib/definitions";
import { groupCategories } from "@/lib/utils";
import { FunnelIcon } from "@heroicons/react/24/outline";
import {
    Badge,
    Button,
    Divider,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@nextui-org/react";
import { Brand, Category, Collection } from "@prisma/client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function FilterPopover({
    columnFilters,
    setColumnFilters,
}: {
    columnFilters: TypeFilter[];
    setColumnFilters: Dispatch<SetStateAction<TypeFilter[]>>;
}) {
    // const [selectedKeys, setSelectedKeys] = useState<string[]>([""]);
    // console.log({ columnFilters });

    const filterCategories =
        columnFilters.find((f) => f.id === "category")?.value || [];
    const filterBrands =
        columnFilters.find((f) => f.id === "brand")?.value || [];
    const filterCollections =
        columnFilters.find((f) => f.id === "collections")?.value || [];
    // console.log({ filterCollections });

    const filterGender =
        columnFilters.find((f) => f.id === "gender")?.value || [];

    const totalFiltered = filterCategories.length + filterGender.length;
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchDatas = async () => {
            const [categories, brands, collections] = await Promise.all([
                getCategories(),
                getBrands(),
                getCollections(),
            ]);
            setCategories(categories as ICategory[]);
            setBrands(brands);
            setCollections(collections);
            setLoading(false);
        };
        setLoading(true);

        fetchDatas();
    }, []);

    const handleSelectPopover = (categoryName: string, columnId: string) => {
        // setSelectedKeys([categoryName]);
        setColumnFilters((prev) => {
            const cates = prev.find((filter) => filter.id === columnId)?.value;
            if (!cates) {
                return prev.concat({
                    id: columnId,
                    value: [categoryName],
                });
            }
            return prev.map((filter) =>
                filter.id === columnId
                    ? {
                          ...filter,
                          value: (filter.value as string[]).includes(
                              categoryName
                          )
                              ? (filter.value as string[]).filter(
                                    (v) => v !== categoryName
                                )
                              : [...(filter.value as string[]), categoryName],
                      }
                    : filter
            );
        });
    };
    const FilterItem = ({
        listContain,
        columnId,
        value,
    }: {
        listContain: string[];
        value: string;
        columnId: string;
    }) => {
        return (
            <Button
                key={value}
                onClick={() => handleSelectPopover(value, columnId)}
                className="w-full justify-start"
                size="sm"
                radius="sm"
                variant={listContain.includes(value) ? "solid" : "light"}
                color={listContain.includes(value) ? "primary" : "default"}
            >
                {value}
            </Button>
        );
    };
    const groupedCategories = groupCategories(categories);
    return (
        <Popover
            showArrow
            placement="bottom"
            aria-label="filter popover"
            classNames={{
                content: "p-0",
            }}
        >
            <Badge
                content={totalFiltered}
                isInvisible={totalFiltered === 0}
                color="primary"
            >
                <PopoverTrigger>
                    <Button
                        isIconOnly
                        variant="bordered"
                        size="md"
                        color={totalFiltered > 0 ? "primary" : "default"}
                    >
                        <FunnelIcon className="w-6 h-6" />
                    </Button>
                </PopoverTrigger>
            </Badge>
            <PopoverContent className="relative min-w-60">
                {loading ? (
                    <Loading />
                ) : (
                    <div className="flex">
                        <div className="w-full ">
                            <div className="flex justify-between items-center mb-2 w-full px-4 pt-4">
                                <small className="text-gray-500 pointer-events-none">
                                    Filter by:
                                </small>
                                <strong className="pointer-events-none">
                                    Gender
                                </strong>
                            </div>
                            <Divider />
                            <div
                                aria-label="Filter popover gender"
                                className="w-full px-4 pb-4 pt-2 "
                            >
                                {["MEN", "WOMEN", "UNISEX"].map((gender) => (
                                    <FilterItem
                                        key={gender}
                                        value={gender}
                                        columnId="gender"
                                        listContain={filterGender as string[]}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="w-full ">
                            <div className="flex justify-between items-center mb-2 w-full px-4 pt-4">
                                <small className="text-gray-500 pointer-events-none">
                                    Filter by:
                                </small>
                                <strong className="pointer-events-none">
                                    Brand
                                </strong>
                            </div>
                            <Divider />
                            <div
                                aria-label="Filter popover brand"
                                className="w-full px-4 pb-4 pt-2 "
                            >
                                {brands.length > 0 &&
                                    brands.map((brand) => (
                                        <FilterItem
                                            key={brand.id}
                                            value={brand.name}
                                            columnId="brand"
                                            listContain={
                                                filterBrands as string[]
                                            }
                                        />
                                    ))}
                            </div>
                        </div>
                        <div className="w-full ">
                            <div className="flex justify-between items-center mb-2 w-full px-4 pt-4">
                                <small className="text-gray-500 pointer-events-none">
                                    Filter by:
                                </small>
                                <strong className="pointer-events-none">
                                    Categories
                                </strong>
                            </div>
                            <Divider />
                            <div
                                aria-label="Filter popover category"
                                className="w-full px-4 pb-4 pt-2 max-h-80 overflow-auto"
                            >
                                {Object.keys(groupedCategories).map(
                                    (parentId) => (
                                        <div
                                            key={parentId}
                                            className="w-full flex flex-col items-start"
                                        >
                                            <small className="text-gray-500 pointer-events-none">
                                                {parentId !== "null"
                                                    ? categories.find(
                                                          (c) =>
                                                              c.id === parentId
                                                      )?.name
                                                    : "No Parent"}
                                            </small>
                                            {groupedCategories[parentId].map(
                                                (category) => (
                                                    <FilterItem
                                                        key={category.id}
                                                        columnId="category"
                                                        listContain={
                                                            filterCategories as string[]
                                                        }
                                                        value={category.name}
                                                    />
                                                )
                                            )}
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                        <div className="w-full ">
                            <div className="flex justify-between items-center mb-2 w-full px-4 pt-4">
                                <small className="text-gray-500 pointer-events-none">
                                    Filter by:
                                </small>
                                <strong className="pointer-events-none">
                                    Collection
                                </strong>
                            </div>
                            <Divider />
                            <div
                                aria-label="Filter popover collection"
                                className="w-full px-4 pb-4 pt-2 "
                            >
                                {collections.length > 0 &&
                                    collections.map((collection) => (
                                        <FilterItem
                                            key={collection.id}
                                            value={collection.name}
                                            columnId="collections"
                                            listContain={
                                                filterCollections as string[]
                                            }
                                        />
                                    ))}
                            </div>
                        </div>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
