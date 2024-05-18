"use client";
import { ICart, IFindProduct } from "@/lib/definitions";
import { getPublicIdFromUrl, getUniqueSizes, renderPrice } from "@/lib/utils";
import {
    Button,
    Image,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalProps,
    RadioGroup,
} from "@nextui-org/react";
import { Cart, Variation } from "@prisma/client";
import { useEffect, useMemo, useState } from "react";
import ReactImageGallery from "react-image-gallery";
import CustomRadio from "../ui/custom-radio";
import "react-image-gallery/styles/css/image-gallery.css";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { addToCart } from "@/features/order-slice";

interface ModelSelectedProductProps {
    product: IFindProduct;
    isOpen: boolean;
    onOpenChange: () => void;
}
export default function ModelSelectedProduct(props: ModelSelectedProductProps) {
    const { isOpen, onOpenChange, product } = props;
    const dispatch = useAppDispatch();
    const [selectedColor, setSelectedColor] = useState<string>(
        product.gallery[0].color
    );
    console.table(product.variations);
    console.table(product.gallery);
    console.table(product.variations.map((variation) => variation.images));

    const [selectedSize, setSelectedSize] = useState<string>("");
    const { cart } = useAppSelector((store) => store.order);

    // const uniqueColors = getUniqueColors(product.variations);
    const uniqueSizes = useMemo(
        () => getUniqueSizes(product.variations).sort(),
        [product]
    );
    const unAvailableSizes = useMemo(
        () =>
            product.variations
                .filter(
                    (variation) =>
                        variation.color === selectedColor &&
                        variation.stock === 0
                )
                .map((varr) => varr.size),
        [product, selectedColor]
    );
    console.log(selectedColor);
    const images = useMemo(() => {
        const variation = product.variations.find(
            (item) => item.color === selectedColor
        );

        if (!variation) return [];
        const images = variation.images.map((image) => ({
            original: image,
            thumbnail: image,
        }));

        return images;
    }, [product, selectedColor]);
    const handleAddToCart = (onClose: () => void) => {
        const selectedVariation = product.variations.find(
            (v) => v.color === selectedColor && v.size === selectedSize
        );
        if (!selectedVariation) {
            console.log("Invalid variation");
            return;
        }

        const newCartItem: ICart = {
            variationId: selectedVariation.id,
            variation: selectedVariation,
            quantity: 1,
            product: product,
            productId: product.id,
            userId: null,
        };
        dispatch(addToCart(newCartItem));
        onClose();
    };
    useEffect(() => {
        setSelectedColor(product.gallery[0].color);
    }, [product]);

    return (
        <Modal
            size="5xl"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            isDismissable={false}
            isKeyboardDismissDisabled={true}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalBody>
                            <div className="w-full flex gap-4">
                                <div className="w-3/5 ">
                                    <ReactImageGallery
                                        lazyLoad={true}
                                        items={images}
                                        showThumbnails={true}
                                        thumbnailPosition="left"
                                        showBullets={false}
                                        showFullscreenButton={false}
                                        showPlayButton={false}
                                        showNav={false}
                                        slideOnThumbnailOver={true}
                                    />
                                </div>
                                <div className="w-2/5">
                                    <div className="px-8 flex flex-col gap-4">
                                        <div>
                                            <h3 className="font-semibold text-2xl text-foreground">
                                                {product.name}
                                            </h3>

                                            <p className="text-foreground text-medium font-semibold">
                                                {product.description}
                                            </p>
                                        </div>
                                        <div>
                                            <strong>
                                                {renderPrice(
                                                    product.price,
                                                    product.priceCurrency
                                                )}
                                            </strong>
                                        </div>
                                        {product.gallery.length > 1 && (
                                            <RadioGroup
                                                // aria-label="color"
                                                label="Select color"
                                                value={selectedColor}
                                                onValueChange={setSelectedColor}
                                                classNames={{
                                                    base: " capitalize",
                                                }}
                                                orientation="horizontal"
                                            >
                                                {product.gallery.map(
                                                    (gallery) => (
                                                        <CustomRadio
                                                            classNames={{
                                                                label: "!p-0 ",
                                                            }}
                                                            value={
                                                                gallery.color
                                                            }
                                                            key={gallery.color}
                                                            className="text-medium text-foreground"
                                                        >
                                                            {/* {gallery.color} */}
                                                            <Image
                                                                src={
                                                                    gallery.image
                                                                }
                                                                alt={getPublicIdFromUrl(
                                                                    gallery.image
                                                                )}
                                                                className="aspect-square w-20 rounded-md"
                                                            />
                                                        </CustomRadio>
                                                    )
                                                )}
                                            </RadioGroup>
                                        )}
                                        {uniqueSizes.length > 0 && (
                                            <RadioGroup
                                                // aria-label="size"
                                                label="Select Size"
                                                // value={filterOptions?.sizes || []}
                                                // onValueChange={(value) =>
                                                //     handleSelectFilter(value, "sizes")
                                                // }
                                                onValueChange={setSelectedSize}
                                                classNames={{
                                                    base: " capitalize",
                                                }}
                                                orientation="horizontal"
                                            >
                                                {uniqueSizes.map((size) => (
                                                    <CustomRadio
                                                        value={size}
                                                        key={size}
                                                        className="text-medium text-foreground"
                                                        isDisabled={unAvailableSizes.includes(
                                                            size
                                                        )}
                                                    >
                                                        {size}
                                                    </CustomRadio>
                                                ))}
                                            </RadioGroup>
                                        )}
                                        <Button
                                            className="w-full font-semibold"
                                            color="primary"
                                            isDisabled={
                                                !selectedSize || !selectedColor
                                            }
                                            onClick={() =>
                                                handleAddToCart(onClose)
                                            }
                                        >
                                            Add to cart
                                            <ShoppingCartIcon className="w-5 h-5" />
                                        </Button>
                                        {product.summary && (
                                            <div>
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: product.summary,
                                                    }}
                                                ></div>
                                            </div>
                                        )}
                                        {/* <button
                            onClick={onOpen}
                            className="flex items-center justify-start"
                        >
                            <span className="underline cursor-pointer font-semibold hover:opacity-90">
                                View product detail
                            </span>
                        </button> */}
                                        {/* <Divider /> */}
                                        {/* <Collapse title="Size & Fit">
                            <ul>
                                <li>Standard fit: easy and traditional</li>
                                <li>
                                    <a href="#">Size Guide</a>
                                </li>
                            </ul>
                        </Collapse>
                        <Divider />
                        <Collapse title="Free Delivery and Returns">
                            <p>
                                Your order of $200 or more gets free standard
                                delivery.
                            </p>
                            <ul>
                                <li>Standard delivered 4-5 Business Days</li>
                                <li>Express delivered 2-4 Business Days</li>
                            </ul>
                            <p>
                                Orders are processed and delivered Monday-Friday
                                (excluding public holidays)
                            </p>
                        </Collapse>
                        <Divider />
                        <Collapse title="Review">
                            <p>Review...</p>
                        </Collapse> */}
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
