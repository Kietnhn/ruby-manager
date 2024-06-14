"use client";

import { InboxArrowDownIcon, PencilIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
// import { Image as TypeImage } from "@/lib/definitions";
import { useDisclosure } from "@nextui-org/modal";
import ModalUploadImages from "./modal-upload-images";
import { Button } from "@nextui-org/react";
import GallerySortable from "@/components/gallery-sortable";
import { Image as TypeImage, Variation } from "@prisma/client";
import { generateToImagesFromUrls } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { setGallery } from "@/features/product-slice";
import { TGallery } from "@/lib/definitions";
const Gallery = ({
    // setVariations,
    // variations,
    // variation,
    variationColor,
}: {
    // variations: Variation[];
    // variation: Variation;
    // setVariations: Dispatch<SetStateAction<Variation[]>>;
    variationColor: string;
}) => {
    const { gallery } = useAppSelector((store) => store.product);
    const dispatch = useAppDispatch();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [images, setImages] = useState<TypeImage[]>(() => {
        // const currentItem = gallery.find(
        //     (item) => item.color === variationColor
        // );
        // if (!currentItem) return [];
        // return generateToImagesFromUrls(currentItem.images);
        return [];
    });
    useEffect(() => {
        const currentItem = gallery.find(
            (item) => item.color === variationColor
        );
        if (!currentItem) return setImages([]);
        setImages(generateToImagesFromUrls(currentItem.images));
    }, [variationColor]);
    useEffect(() => {
        if (images.length === 0) return;

        const newGallery = gallery.map((item) =>
            item.color === variationColor
                ? { ...item, images: images.map((img) => img.url) }
                : item
        );
        dispatch(setGallery(newGallery));
    }, [images]);
    return (
        <div className="w-full  flex flex-col min-h-64 rounded-medium">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <span className="mr-1 capitalize">
                        <small className="pr-1 capitalize">color:</small>
                        {variationColor}
                    </span>
                </div>
                {images.length > 0 && (
                    <Button onClick={onOpen} type="button" size="sm">
                        <PencilIcon className="w-4 h-4" />
                        <p className="text-sm">Edit</p>
                    </Button>
                )}
            </div>
            {images.length === 0 ? (
                <button
                    onClick={onOpen}
                    className="flex-1   hover:bg-gray-200 duration-100 relative rounded-medium"
                    type="button"
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
                        <div className="text-center flex flex-col justify-center items-center">
                            <InboxArrowDownIcon className="w-10 h-10" />
                            <h3 className="text-medium">Upload images</h3>
                        </div>
                    </div>
                </button>
            ) : (
                <GallerySortable gallery={images} setGallery={setImages} />
            )}
            <ModalUploadImages
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                gallery={images}
                setGallery={setImages}
            />
        </div>
    );
};
export default Gallery;
