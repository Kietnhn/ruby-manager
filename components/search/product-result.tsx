"use client";

import { searchProducts } from "@/lib/actions/product";
import { IFindProduct } from "@/lib/definitions";
import { renderPrice } from "@/lib/utils";
import {
    Card,
    CardBody,
    CardFooter,
    Image,
    useDisclosure,
} from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SearchProductSkeleton } from "../skeletons";
import ModelSelectedProduct from "../orders/modal-select-product";

export default function SearchProductResult() {
    const searchParams = useSearchParams();
    const searchValue = searchParams.get("search") || "";
    const [result, setResult] = useState<IFindProduct[]>([]);
    const [loading, setLoading] = useState<Boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<IFindProduct | null>(
        null
    );
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    // functions
    const handleSelectProduct = (product: IFindProduct) => {
        setSelectedProduct(product);
        onOpen();
    };

    useEffect(() => {
        setLoading(true);
        async function fetchProducts() {
            const products = await searchProducts(searchValue);
            setResult(products);
            setLoading(false);
        }
        fetchProducts();
    }, [searchValue]);
    if (loading) return <SearchProductSkeleton />;
    return (
        <div className="w-full">
            <div className="grid grid-cols-3  gap-4">
                {result.map((product) => (
                    <Card
                        key={product.id}
                        isPressable
                        shadow="sm"
                        onPress={() => handleSelectProduct(product)}
                    >
                        <CardBody className="overflow-visible p-0">
                            <Image
                                shadow="sm"
                                width="100%"
                                alt={product.name}
                                className="w-full object-cover rounded-b-none"
                                src={product.gallery[0].image}
                            />
                        </CardBody>
                        <CardFooter className="flex flex-row items-center justify-between">
                            <div className="flex flex-col gap-1 items-start">
                                <strong className="line-clamp-1 text-start">
                                    {product.name}
                                </strong>
                                <p className="line-clamp-1 text-start">
                                    {product.category?.name}
                                </p>
                            </div>
                            <strong>
                                {renderPrice(
                                    product.price,
                                    product.priceCurrency
                                )}
                            </strong>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            {selectedProduct && (
                <ModelSelectedProduct
                    product={selectedProduct}
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                />
            )}
        </div>
    );
}
