"use client";
import { FullProduct } from "@/lib/definitions";
import { getPublicIdFromUrl, getUniqueSizes, renderPrice } from "@/lib/utils";
import { Divider, RadioGroup, Avatar, Image } from "@nextui-org/react";
import React, { useMemo, useState } from "react";
import ReactImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import CustomRadio from "../ui/custom-radio";
import Collapse from "../collapse";
import ProductDetailsSummary from "./product-details-summary";
import ProductReviews from "./reviews";
import { IReviewWithUser, ISummarisePoint } from "@/lib/definitions/review";

const ProductDetails = ({
    product,
    summarise,
    reviews,
}: {
    product: FullProduct;
    summarise: ISummarisePoint;
    reviews: IReviewWithUser[];
}) => {
    const [selectedColor, setSelectedColor] = useState<string>(
        product.gallery[0].color
    );
    const [selectedSize, setSelectedSize] = useState<string>("");
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
        [product]
    );

    const images = useMemo(
        () =>
            product.gallery
                .filter((item) => item.color === selectedColor)
                .map((item) => ({
                    original: item.image,
                    thumbnail: item.image,
                })),
        [product, selectedColor]
    );
    console.table(product.gallery);
    console.log({ images });

    return (
        <>
            <div className="flex gap-4 flex-nowrap relative">
                <div className="w-3/5 sticky top-0 h-4/5 py-12">
                    <ReactImageGallery
                        items={images}
                        thumbnailPosition="left"
                        showBullets={false}
                        showFullscreenButton={false}
                        showPlayButton={false}
                        showNav={false}
                        slideOnThumbnailOver={true}
                        renderItem={(item) => (
                            <Image
                                radius="sm"
                                src={item.original}
                                alt={item.originalAlt}
                                className="w-full h-auto"
                            />
                        )}
                        renderThumbInner={(item) => (
                            <Image
                                radius="sm"
                                src={item.thumbnail}
                                alt={item.thumbnailAlt}
                                className="w-full h-auto"
                            />
                        )}
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
                            <div className="">
                                {/* <h4 className="text-foreground text-medium font-semibold">
                                    Select color
                                </h4> */}
                                <RadioGroup
                                    // aria-label="color"
                                    label="Select color"
                                    value={selectedColor}
                                    onValueChange={setSelectedColor}
                                    classNames={{
                                        base: " capitalize",
                                        label: "rounded-sm",
                                    }}
                                    orientation="horizontal"
                                >
                                    {product.gallery.map((gallery) => (
                                        <CustomRadio
                                            classNames={{
                                                label: "!p-0 ",
                                            }}
                                            value={gallery.color}
                                            key={gallery.color}
                                            className="text-medium text-foreground"
                                        >
                                            {/* {gallery.color} */}
                                            {/* <Image
                                                src={gallery.image}
                                                alt={getPublicIdFromUrl(
                                                    gallery.image
                                                )}
                                                className="aspect-square w-20 rounded-md"
                                            /> */}
                                            <Avatar
                                                size="lg"
                                                radius="sm"
                                                src={gallery.image}
                                                alt={getPublicIdFromUrl(
                                                    gallery.image
                                                )}
                                            />
                                        </CustomRadio>
                                    ))}
                                </RadioGroup>
                            </div>
                        )}
                        {uniqueSizes.length > 0 && (
                            <div>
                                {/* <h4 className="text-foreground text-medium font-semibold">
                                    Select Size
                                </h4> */}

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
                            </div>
                        )}
                        <ProductDetailsSummary
                            productSummary={product.summary}
                        />

                        <Divider />
                        <Collapse
                            isBordered={false}
                            title={
                                <h3 className="text-lg font-semibold">
                                    Size & Fit
                                </h3>
                            }
                        >
                            <ul>
                                <li>Standard fit: easy and traditional</li>
                                <li>
                                    <a href="#">Size Guide</a>
                                </li>
                            </ul>
                        </Collapse>
                        <Divider />
                        <Collapse
                            isBordered={false}
                            title={
                                <h3 className="text-lg font-semibold">
                                    Free Delivery and Returns
                                </h3>
                            }
                        >
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
                        <ProductReviews
                            product={product}
                            selectedColor={selectedColor}
                            summarise={summarise}
                            reviews={reviews}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetails;
