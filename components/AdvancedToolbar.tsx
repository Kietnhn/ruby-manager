"use client";

import React, { useEffect, useState } from "react";
import { type Editor } from "@tiptap/react";
import { useCallback } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
    Tooltip,
} from "@nextui-org/react";
import { Image, Link } from "lucide-react";
import StoreImages from "./store-images";
import { Image as TypeImage } from "@prisma/client";

type Props = {
    editor: Editor | null;
};

const AdvancedToolbar = ({ editor }: Props) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [typeModal, setTypeModal] = useState<"image" | "link">("link");
    const [selectedImage, setSelectedImage] = useState<TypeImage[]>([]);
    const [input, setInput] = useState<string>("");
    if (!editor) {
        return null;
    }
    const handleOpenImage = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        setTypeModal("image");
        onOpen();
    };
    const handleOpenLink = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        setTypeModal("link");
        onOpen();
    };
    const addImage = (onClose: () => void) => {
        if (!input) return;
        const url = input;
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
        onClose();
    };

    const toggleLink = (onClose: () => void) => {
        console.log("toggle link");
        console.log({ input });

        if (!input) return;
        const url = input;
        // update link
        editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run();
        onClose();
    };

    useEffect(() => {
        if (selectedImage.length > 0) {
            setInput(selectedImage[0].url);
        }
    }, [selectedImage]);
    return (
        <div className="p-1">
            <div className="flex justify-start items-center gap-1 w-full ">
                <Tooltip showArrow content="Image">
                    <Button
                        size="sm"
                        variant="light"
                        isIconOnly
                        onClick={handleOpenImage}
                        className={
                            editor.isActive("image")
                                ? "bg-black text-white"
                                : "text-foreground"
                        }
                    >
                        <Image className="w-5 h-5" />
                    </Button>
                </Tooltip>
                <Tooltip showArrow content="Link">
                    <Button
                        size="sm"
                        variant="light"
                        isIconOnly
                        onClick={handleOpenLink}
                        className={
                            editor.isActive("link")
                                ? "bg-black text-white"
                                : "text-foreground"
                        }
                    >
                        <Link className="w-5 h-5" />
                    </Button>
                </Tooltip>
            </div>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {typeModal === "image"
                                    ? "Insert a image"
                                    : "Insert a link"}
                            </ModalHeader>
                            <ModalBody>
                                {typeModal === "image" ? (
                                    <div className="">
                                        <div className="w-full mb-4">
                                            <Input
                                                autoFocus
                                                label="Image url"
                                                placeholder="Enter your image url"
                                                variant="bordered"
                                                value={input}
                                                onValueChange={setInput}
                                            />
                                        </div>
                                        <div className="">
                                            <h3>Store images</h3>
                                            <div className="w-full max-h-80 overflow-auto">
                                                <StoreImages
                                                    selectMode="single"
                                                    gallery={selectedImage}
                                                    setGallery={
                                                        setSelectedImage
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="">
                                        <Input
                                            autoFocus
                                            label="Link url"
                                            placeholder="Enter your url"
                                            variant="bordered"
                                            value={input}
                                            onValueChange={setInput}
                                        />
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="flat"
                                    onPress={onClose}
                                >
                                    Close
                                </Button>
                                {typeModal === "image" ? (
                                    <Button
                                        color="primary"
                                        onPress={() => addImage(onClose)}
                                    >
                                        Insert
                                    </Button>
                                ) : (
                                    <Button
                                        color="primary"
                                        onPress={() => toggleLink(onClose)}
                                    >
                                        Insert
                                    </Button>
                                )}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default AdvancedToolbar;
