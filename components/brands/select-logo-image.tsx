"use client";
import { Card, Image, useDisclosure } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import ModalUploadImages from "@/components/products/modal-upload-images";
import { Image as TypeImage } from "@prisma/client";
import { getPublicIdFromUrl } from "@/lib/utils";

const SelectLogoImage = ({
    logo,
    setLogo,
}: {
    logo: string;
    setLogo: React.Dispatch<React.SetStateAction<string>>;
}) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [images, setImages] = useState<TypeImage[]>([]);
    useEffect(() => {
        const image = images[0];
        if (!image) return;
        setLogo(image.url);
    }, [images]);
    return (
        <div className="relative">
            <label
                htmlFor=""
                className="text-center block text-foreground text-small mb-2"
            >
                Logo
            </label>
            <Card
                className="w-full min-w-28 aspect-square "
                isPressable
                onPress={() => onOpen()}
            >
                {images.length > 0 && (
                    <Image
                        src={images[0].url}
                        alt={getPublicIdFromUrl(images[0].url)}
                        width={"100%"}
                    />
                )}
            </Card>
            <ModalUploadImages
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                gallery={images}
                setGallery={setImages}
                selectMode="single"
            />
        </div>
    );
};

export default SelectLogoImage;
