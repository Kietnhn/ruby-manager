"use client";

import Collapse from "../collapse";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
    Link,
    Image,
} from "@nextui-org/react";

import { FullProduct } from "@/lib/definitions";
import { StarRatingReadyOnly } from "./star-rating";

import { IReviewWithUser, ISummarisePoint } from "@/lib/definitions/review";
import CreateFormReview from "../forms/create-form-review";
import { DEFAULT_LOCALE } from "@/lib/constants";
import moment from "moment";

export default function ProductReviews({
    product,
    selectedColor,
    summarise,
    reviews,
}: {
    product: FullProduct;
    summarise: ISummarisePoint;
    reviews: IReviewWithUser[];

    selectedColor: string;
}) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <>
            <Collapse
                isBordered={false}
                title={
                    <div className="flex-1 flex justify-between items-center">
                        <h3 className="text-lg font-semibold">
                            Reviews ({summarise.count})
                        </h3>
                        <StarRatingReadyOnly rating={summarise?.average || 5} />
                    </div>
                }
            >
                <div className="flex flex-col gap-6">
                    <button
                        onClick={onOpen}
                        className="flex items-center justify-start"
                    >
                        <span className="underline cursor-pointer font-semibold hover:opacity-90">
                            Write review
                        </span>
                    </button>
                    <div className="flex flex-col gap-4 ">
                        {reviews.map((review) => (
                            <ReviewItem review={review} key={review.id} />
                        ))}
                        <Link
                            underline="hover"
                            href={`/dashboard/products/${product.id}/reviews`}
                            className="font-semibold hover:cursor-pointer text-foreground"
                        >
                            More reviews
                        </Link>
                    </div>
                </div>
            </Collapse>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="3xl"
                placement="center"
                scrollBehavior="inside"
                classNames={{
                    body: "custom-scrollbar",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex-center flex-col gap-1">
                                <h1 className="text-xl font-semibold">
                                    Write your review
                                </h1>
                                <p className="text-foreground-500 font-normal">
                                    Share your thoughts with the community.
                                </p>
                            </ModalHeader>
                            <ModalBody>
                                <CreateFormReview
                                    product={product}
                                    selectedColor={selectedColor}
                                />
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
function ReviewItem({ review }: { review: IReviewWithUser }) {
    return (
        <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">{review.heading}</h3>
            <div className="flex gap-4 items-center">
                {review.point && <StarRatingReadyOnly rating={review.point} />}
                <p className="text-medium text-foreground-500 ">
                    <span>{review.user.name || review.user.firstName}</span>
                    {" - "}
                    <span suppressHydrationWarning>
                        {moment(review.createdAt).fromNow()}
                    </span>
                </p>
            </div>
            <p>{review.content}</p>
            {review.images.length > 0 && (
                <div className="flex gap-2">
                    {review.images.map((image) => (
                        <Image
                            className="w-32 aspect-square mb-2"
                            src={image}
                            alt={image}
                        ></Image>
                    ))}
                </div>
            )}
        </div>
    );
}
