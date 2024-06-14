import { useEffect, useState } from "react";
import { Image as TypeImage } from "@prisma/client";
import { getImages, saveImage } from "../lib/actions";

const useStoreImage = (selectMode = "multiple") => {
    const [images, setImages] = useState<TypeImage[]>([]);
    const [selectedImages, setSelectedImages] = useState<TypeImage[]>([]);

    const handleUploaded = async (result: any) => {
        // Adjust the type if necessary
        const newImage = await saveImage(result);
        setImages([newImage, ...images]);
    };

    const handleSelectImage = (img: TypeImage) => {
        const existedImage = selectedImages.find(
            (image) => image.public_id === img.public_id
        );
        if (existedImage) {
            setSelectedImages(
                selectedImages.filter(
                    (image) => image.public_id !== img.public_id
                )
            );
        } else {
            if (selectMode === "single") {
                setSelectedImages([img]);
            } else {
                setSelectedImages([...selectedImages, img]);
            }
        }
    };

    useEffect(() => {
        getImages().then(setImages);
    }, []);

    return {
        images,
        selectedImages,
        handleUploaded,
        handleSelectImage,
        setSelectedImages,
    };
};

export default useStoreImage;
