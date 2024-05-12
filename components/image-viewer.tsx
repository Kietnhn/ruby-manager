import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/modal";
import { Button, Image, Tooltip } from "@nextui-org/react";
import { Image as TypeImage } from "@prisma/client";
import React from "react";
import NextImage from "next/image";
const ImageViewer = ({
    images,
    isOpen,
    onOpenChange,
}: {
    images: TypeImage[];
    isOpen: any;
    onOpenChange: any;
}) => {
    const [currentImageIndex, setCurrentImageIndex] = React.useState<number>(0);
    const handleNext = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handlePrev = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };
    return (
        <>
            <Modal
                size="full"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                classNames={{
                    closeButton:
                        "fixed top-5 right-0 -translate-x-full z-10 bg-default",
                    header: "p-4",
                    base: "bg-[rgba(0,0,0,0.55)]",
                    // wrapper: "bg-[transparent]",
                }}
                backdrop="blur"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="fixed top-0 left-0 right-0 flex flex-col gap-1 opac">
                                <div className="flex pl-4 text-white">
                                    <strong className="text-white">
                                        {currentImageIndex + 1}
                                    </strong>
                                    /{images.length}
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <div className="fixed top-1/2 left-0 -translate-y-1/2 translate-x-full z-10">
                                    <Tooltip content="Prev">
                                        <Button
                                            isIconOnly
                                            className="rounded-full"
                                            onClick={handlePrev}
                                        >
                                            <ChevronLeftIcon className="w-5 h-5" />
                                        </Button>
                                    </Tooltip>
                                </div>
                                <div className="fixed top-1/2 right-0 -translate-y-1/2 -translate-x-full z-10">
                                    <Tooltip content="Next">
                                        <Button
                                            isIconOnly
                                            className="rounded-full"
                                            onClick={handleNext}
                                        >
                                            <ChevronRightIcon className="w-5 h-5" />
                                        </Button>
                                    </Tooltip>
                                </div>
                                <div className="flex justify-center items-center h-screen">
                                    <Image
                                        width={500}
                                        height={600}
                                        classNames={{
                                            img: "max-w-screen max-h-screen",
                                        }}
                                        as={NextImage}
                                        src={images[currentImageIndex].url}
                                        alt="NextUI hero Image"
                                    />
                                </div>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default ImageViewer;
