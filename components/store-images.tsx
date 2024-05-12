import { CldUploadWidget, CldUploadWidgetResults } from "next-cloudinary";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Image as TypeImage } from "@prisma/client";
import { getImages, saveImage } from "../lib/actions";
import { Button, Card, Checkbox, Image } from "@nextui-org/react";

const StoreImages = ({
    gallery,
    setGallery,
    selectMode = "multiple",
}: {
    gallery: TypeImage[];
    setGallery: Dispatch<SetStateAction<TypeImage[]>>;

    selectMode?: "single" | "multiple";
}) => {
    const [images, setImages] = useState<TypeImage[]>([]);
    // const [gallery, setGallery] = useState<TypeImage[]>(gallery);
    const handleUploaded = async (result: CldUploadWidgetResults) => {
        const newImage = await saveImage(result);
        setImages([newImage, ...images]);
    };
    const handleSelectImage = (img: TypeImage) => {
        const existedImage = gallery.find(
            (image) => image.public_id === img.public_id
        );
        if (existedImage) {
            setGallery(
                gallery.filter((image) => image.public_id !== img.public_id)
            );
        } else {
            if (selectMode === "single") {
                setGallery([img]);
            } else {
                setGallery([...gallery, img]);
            }
        }
    };
    // const handlegallerys = () => {
    //     setGallery(gallery);
    // };
    useEffect(() => {
        getImages().then((images) => setImages(images));
    }, []);
    return (
        <div>
            <div className="flex justify-between items-center">
                <h3 className=" text-xl font-semibold">Store images</h3>
                <CldUploadWidget
                    signatureEndpoint="/api/sign-cloudinary-params"
                    options={{ folder: "/ruby" }}
                    onUpload={handleUploaded}
                >
                    {({ open }) => {
                        return <Button onClick={() => open()}>Upload</Button>;
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
                                onPress={() => handleSelectImage(image)}
                            >
                                <Image
                                    isZoomed
                                    alt={image.public_id}
                                    src={image.url}
                                />
                                <div className="absolute top-1 right-1 z-50">
                                    {selectMode === "multiple" ? (
                                        <Checkbox
                                            type="checkbox"
                                            name="selected"
                                            id={image.public_id}
                                            isSelected={
                                                !!gallery.find(
                                                    (img) =>
                                                        img.public_id ===
                                                        image.public_id
                                                )
                                            }
                                            onChange={() =>
                                                handleSelectImage(image)
                                            }
                                        />
                                    ) : (
                                        <>
                                            {gallery.length > 0 &&
                                                gallery[0].public_id ===
                                                    image.public_id && (
                                                    <Checkbox
                                                        type="checkbox"
                                                        name="selected"
                                                        id={image.public_id}
                                                        isSelected={
                                                            !!gallery.find(
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
                                                )}
                                        </>
                                    )}
                                </div>
                            </Card>
                        </Card>
                    ))}
                </div>
            )}
            {/* <div>
                <Button onClick={handlegallerys}>Submit</Button>
            </div> */}
        </div>
    );
};

export default StoreImages;
