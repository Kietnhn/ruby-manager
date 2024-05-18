"use client";
import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
    getPublicIdFromUrl,
    getUniqueColors,
    getUniqueVariationColorOfProducts,
    getVariationsHaveDifferentColor,
} from "@/lib/utils";
import {
    Autocomplete,
    AutocompleteItem,
    AutocompleteSection,
    Card,
    Image,
} from "@nextui-org/react";
import { findProducts, searchProducts } from "@/lib/actions/product";
import { FullOrderProduct, FullProduct, IFindProduct } from "@/lib/definitions";
import { useDebounce, useDebouncedCallback } from "use-debounce";
const AutocomleteProducts = ({
    data,
    setData,
}: {
    data: FullOrderProduct[];
    setData: React.Dispatch<React.SetStateAction<FullOrderProduct[]>>;
}) => {
    const [searchData, setSearchData] = useState<IFindProduct[]>([]);
    // const [inputValue, setInputValue] = useState<string>("");
    // const [debouncedInputValue] = useDebounce(inputValue, 300);
    const handleFindProducts = async (value: string) => {
        const products = await searchProducts(value);
        console.log({ products });

        setSearchData(products);
    };
    const handleChangeInput = useDebouncedCallback((value: string) => {
        if (!value) return;
        handleFindProducts(value);
    }, 300);

    const handleSelectProduct = (key: string) => {
        console.log({ key });
        if (!key) {
            return;
        }

        const selectedProduct = searchData.find((product) =>
            product.variations.find((variation) => variation.id === key)
        );
        if (!selectedProduct) return;
        console.log({ selectedProduct });
        const selectedVariation = selectedProduct.variations.find(
            (variation) => variation.id === key
        );
        if (!selectedVariation) return;
        const availabelVariation = selectedProduct.variations.find(
            (variation) =>
                variation.color === selectedVariation.color &&
                variation.stock > 0
        );
        if (!availabelVariation) return;
        const isExisted = data.find(
            (item) => item.variationId === selectedVariation.id
        );
        if (isExisted) {
            const newData = data.map((item) =>
                item.variationId === selectedVariation.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
            setData(newData);
        } else {
            const newDataItem = {
                id: `data-order-product-${data.length + 1}`,
                priceCurrency: "USD",
                quantity: 1,
                price: selectedProduct.price,
                variation: availabelVariation,
                subTotal: selectedProduct.price,
                product: selectedProduct,
                orderId: "",
                variationId: availabelVariation.id,
                createdAt: new Date(),
                updatedAt: new Date(),
                productId: selectedProduct.id,
            };
            setData([...data, newDataItem]);
        }

        // reset
        // setSearchData([]);
        // setInputValue("");
    };

    useEffect(() => {
        console.log({ searchData });
    }, [searchData]);
    // useEffect(() => {
    //     if (!debouncedInputValue) return;
    //     console.log(debouncedInputValue);

    //     handleFindProducts(debouncedInputValue);
    // }, [debouncedInputValue]);
    return (
        <div className="mb-4 flex items-end">
            <Autocomplete
                // onInputChange={(value) => setInputValue(value)}
                onInputChange={handleChangeInput}
                className="rounded-tr-none rounded-br-none"
                label="Search product"
                // labelPlacement="outside-left"
                placeholder="Searching ..."
                inputProps={{
                    classNames: { mainWrapper: "flex-1" },
                }}
                selectedKey={null}
                variant="bordered"
                onSelectionChange={(e) => handleSelectProduct(e as string)}
                startContent={<MagnifyingGlassIcon className="w-5 h-5" />}
                onKeyDown={(e: any) => e.continuePropagation()}
                // value={inputValue}
            >
                {searchData.map((product, index) => (
                    <AutocompleteSection
                        showDivider={index !== searchData.length - 1}
                        title={`${product.name}`}
                        key={index}
                    >
                        {getVariationsHaveDifferentColor(
                            product.variations
                        ).map((variation) => (
                            <AutocompleteItem
                                key={variation.id}
                                textValue={product.name}
                                className="outline-none"
                            >
                                <div className="flex gap-2 items-center">
                                    <Card shadow="none">
                                        <Image
                                            className="w-10 h-10 rounded-medium"
                                            src={variation.images[0]}
                                            alt={getPublicIdFromUrl(
                                                variation.images[0]
                                            )}
                                        />
                                    </Card>
                                    <p>{variation?.name || product.name}</p>
                                    {/* <p>{variation.id}</p> */}
                                    <p>
                                        <small>Color:</small> {variation.color}
                                    </p>
                                </div>
                            </AutocompleteItem>
                        ))}
                    </AutocompleteSection>
                ))}
                {/* {searchData.map((product) => {
                    const uniqueColors = getUniqueColors(product.variations);
                    return (
                        <>
                           { uniqueColors.map((color) => (
                            ))}
                        </>
                    );
                })} */}
            </Autocomplete>
        </div>
    );
};

export default AutocomleteProducts;
// <AutocompleteItem key={product.id} textValue={product.name}>
//     <div className="flex gap-2 items-center">
//         <Card shadow="none">
//             <Image
//                 className="w-10 h-10 rounded-medium"
//                 src={product.gallery[0].image}
//                 // alt={getPublicIdFromUrl(
//                 //     product.gallery[0].image
//                 // )}
//                 alt="Adasnlkdasn"
//             />
//         </Card>
//         <p>{product.name}</p>
//     </div>
// </AutocompleteItem>
