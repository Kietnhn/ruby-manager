"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Button,
    Image,
    ModalFooter,
    Checkbox,
    Card,
} from "@nextui-org/react";
import { getImages, saveImage, updateFieldImages } from "@/lib/actions";
import { CldUploadWidget, CldUploadWidgetResults } from "next-cloudinary";
import { Image as TypeImage } from "@prisma/client";
import { useInView } from "react-intersection-observer";

export default function ModalUploadImages({
    gallery,
    setGallery,
    isOpen,
    onOpenChange,
    selectMode = "multiple",
}: {
    gallery: TypeImage[];
    setGallery: Dispatch<SetStateAction<TypeImage[]>>;
    isOpen: any;
    onOpenChange: (isOpen: boolean) => void;
    selectMode?: "single" | "multiple";
}) {
    const [images, setImages] = useState<TypeImage[]>([]);
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [selectedImage, setSelectedImage] = useState<TypeImage[]>(gallery);
    const [hasMore, setHasMore] = useState(true);
    const { ref, inView } = useInView({
        threshold: 0, // Fire the callback as soon as even one pixel is visible
    });
    const handleUploaded = async (result: CldUploadWidgetResults) => {
        const newImage = await saveImage(result);
        setImages([newImage, ...images]);
    };
    const handleSelectImage = (img: TypeImage) => {
        const existedImage = selectedImage.find(
            (image) => image.public_id === img.public_id
        );
        if (existedImage) {
            setSelectedImage(
                selectedImage.filter(
                    (image) => image.public_id !== img.public_id
                )
            );
        } else {
            if (selectMode === "single") {
                setSelectedImage([img]);
            } else {
                setSelectedImage([...selectedImage, img]);
            }
        }
    };
    const handleSelectedImages = (onClose: () => void) => {
        setGallery(selectedImage);
        onClose();
    };

    async function fetchMoreImages() {
        if (loading) return; // If already loading, do not fetch again
        setLoading(true);
        try {
            const newImages = await getImages(offset);
            if (newImages.length === 0) {
                // If no new images fetched, set hasMore to false
                setHasMore(false);
            } else {
                setImages((prevImages) => [...prevImages, ...newImages]);
                setOffset((prevOffset) => prevOffset + newImages.length);
            }
        } catch (error) {
            console.error("Error fetching images:", error);
        }
        setLoading(false);
    }

    // useEffect(() => {
    //     getImages().then((images) => setImages(images));
    // }, [isOpen]);
    useEffect(() => {
        if (inView && hasMore && !loading) {
            // When list is in view, has more images, and not already loading, fetch more images
            fetchMoreImages();
        }
    }, [inView, hasMore, loading]);
    // useEffect(() => {
    //     updateFieldImages()
    //         .then((images) => console.log("updated"))
    //         .catch(() => console.log("Error updating"));
    // }, []);
    return (
        <>
            <Modal
                size="4xl"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement={"center"}
                scrollBehavior="inside"
                isDismissable={false}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Select images
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex justify-between items-center">
                                    <h3 className=" text-xl font-semibold">
                                        Store images
                                    </h3>
                                    <CldUploadWidget
                                        signatureEndpoint="/api/sign-cloudinary-params"
                                        options={{ folder: "/ruby" }}
                                        onUpload={handleUploaded}
                                    >
                                        {({ open }) => {
                                            return (
                                                <Button onClick={() => open()}>
                                                    Upload
                                                </Button>
                                            );
                                        }}
                                    </CldUploadWidget>
                                </div>

                                {images.length > 0 && (
                                    <div className="flex  -mx-2 flex-wrap">
                                        {images.map((image) => (
                                            <Card
                                                key={image.public_id}
                                                shadow="none"
                                                className=" w-1/4 px-2  mb-4  hover:cursor-pointer shadow-none bg-transparent"
                                            >
                                                <Card
                                                    className="relative w-full  h-full"
                                                    isPressable
                                                    onPress={() =>
                                                        handleSelectImage(image)
                                                    }
                                                >
                                                    <Image
                                                        width={"auto"}
                                                        height={"auto"}
                                                        isZoomed
                                                        alt={image.public_id}
                                                        src={image.url}
                                                    />
                                                    <div className="absolute top-1 right-1 z-50">
                                                        {selectMode ===
                                                        "multiple" ? (
                                                            <Checkbox
                                                                type="checkbox"
                                                                name="selected"
                                                                id={
                                                                    image.public_id
                                                                }
                                                                isSelected={
                                                                    !!selectedImage.find(
                                                                        (img) =>
                                                                            img.public_id ===
                                                                            image.public_id
                                                                    )
                                                                }
                                                                onChange={() =>
                                                                    handleSelectImage(
                                                                        image
                                                                    )
                                                                }
                                                            />
                                                        ) : (
                                                            <>
                                                                {selectedImage.length >
                                                                    0 &&
                                                                    selectedImage[0]
                                                                        .public_id ===
                                                                        image.public_id && (
                                                                        <Checkbox
                                                                            type="checkbox"
                                                                            name="selected"
                                                                            id={
                                                                                image.public_id
                                                                            }
                                                                            isSelected={
                                                                                !!selectedImage.find(
                                                                                    (
                                                                                        img
                                                                                    ) =>
                                                                                        img.public_id ===
                                                                                        image.public_id
                                                                                )
                                                                            }
                                                                            onChange={() =>
                                                                                handleSelectImage(
                                                                                    image
                                                                                )
                                                                            }
                                                                        />
                                                                    )}
                                                            </>
                                                        )}
                                                    </div>
                                                </Card>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                                {loading && <div>Loading...</div>}
                                {!hasMore && (
                                    <p className="text-center">
                                        No images left in the store
                                    </p>
                                )}
                                <div ref={ref}></div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    className="mt-4 w-full"
                                    color="primary"
                                    onClick={() =>
                                        handleSelectedImages(onClose)
                                    }
                                >
                                    Select
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
