"use client";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Image,
    Input,
    Switch,
    Textarea,
    useDisclosure,
} from "@nextui-org/react";
import React, { useState } from "react";
import Tiptap from "../TipTap";
import SelectLogoImage from "../brands/select-logo-image";
import { Image as TypeImage } from "@prisma/client";
import ModalUploadImages from "../products/modal-upload-images";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { createBrand } from "@/lib/actions/brand";
import { useFormState, useFormStatus } from "react-dom";
import CardWrapper from "../ui/card-wrapper";
import DefaultInput from "../ui/default-input";
import DefaultTextArea from "../ui/default-textarea";

const CreateBrandForm = () => {
    const [description, setDescription] = useState<string>("");
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [images, setImages] = useState<TypeImage[]>([]);
    const [isUseVideo, setIsUseVideo] = useState<boolean>(false);
    const [logo, setLogo] = useState<string>("");
    const createBrandWithImages = createBrand.bind(null, images);
    const initialState = { message: null, errors: {} };
    // @ts-ignore
    const [state, dispatch] = useFormState(createBrandWithImages, initialState);
    const handleContentChange = (value: string) => {
        setDescription(value);
    };

    return (
        <div>
            <form action={dispatch}>
                <div className="flex gap-4 flex-nowrap mb-4">
                    <CardWrapper
                        className="w-3/5"
                        heading="Brand infomation"
                        classNames={{ body: "flex gap-4 flex-col" }}
                    >
                        <div className="flex gap-4 items-center">
                            <div className="flex-1 flex flex-col gap-4">
                                <DefaultInput name="name" />

                                <DefaultInput label="Brand Code" name="code" />
                            </div>
                            <div className="">
                                <DefaultTextArea
                                    name="logo"
                                    value={logo}
                                    classNames={{
                                        inputWrapper: "hidden",
                                        label: "hidden",
                                    }}
                                />
                                <SelectLogoImage
                                    logo={logo}
                                    setLogo={setLogo}
                                />
                            </div>
                        </div>
                        <DefaultInput
                            placeholder="Enter brand url"
                            label="URL"
                            name="url"
                        />

                        <DefaultTextArea
                            rows={2}
                            name="slogan"
                            description="A slogan or motto associated with the brand."
                        />
                    </CardWrapper>
                    <CardWrapper
                        className="w-2/5"
                        heading="Brand background"
                        classNames={{ body: "flex gap-4 flex-col" }}
                    >
                        <div className="flex justify-between items-center gap-4">
                            <Switch
                                name="isUseVideo"
                                isSelected={isUseVideo}
                                onValueChange={setIsUseVideo}
                            >
                                Use Video
                            </Switch>
                            <Button onClick={onOpen}>
                                <ArrowUpTrayIcon className="w-5 h-5" />
                                Upload
                            </Button>
                        </div>
                        <div className="w-full h-full aspect-video flex gap-2 ">
                            {images.length > 0 && (
                                <>
                                    {isUseVideo ? (
                                        <VideoCard image={images[0]} />
                                    ) : (
                                        <ImageCard image={images[0]} />
                                    )}
                                </>
                            )}
                            {images.length <= 0 && (
                                <Card className="w-full h-full "></Card>
                            )}
                        </div>
                        {state?.message && (
                            <p className="text-red-500">{state.message}</p>
                        )}
                        <CreateButton />
                    </CardWrapper>
                </div>
                <CardWrapper heading="Description" className="w-full ">
                    <DefaultTextArea
                        name="description"
                        value={description}
                        classNames={{
                            inputWrapper: "hidden",
                            label: "hidden",
                        }}
                    />

                    <Tiptap
                        content={description}
                        onChange={(newContent: string) =>
                            handleContentChange(newContent)
                        }
                    />
                </CardWrapper>
            </form>
            <ModalUploadImages
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                gallery={images}
                setGallery={setImages}
                selectMode={"single"}
            />
        </div>
    );
};
function CreateButton() {
    const { pending } = useFormStatus();
    return (
        <Button
            className="w-full"
            color="primary"
            type="submit"
            isDisabled={pending}
        >
            Add
        </Button>
    );
}

function VideoCard({ image }: { image: TypeImage }) {
    return (
        <Card className="w-full h-full relative shadow-none  aspect-video">
            <div className="absolute inset-0 bg-video"></div>
            <video
                src={image.url}
                autoPlay
                preload="auto"
                loop
                className="w-full h-full"
            ></video>
        </Card>
    );
}
function ImageCard({ image }: { image: TypeImage }) {
    return (
        <Card
            className="w-full h-full relative shadow-none aspect-video"
            key={image.id}
        >
            <Image
                classNames={{
                    wrapper: "h-full",
                }}
                src={image.url}
                alt={image.public_id}
                className="w-full h-full object-cover"
            />
        </Card>
    );
}
export default CreateBrandForm;
