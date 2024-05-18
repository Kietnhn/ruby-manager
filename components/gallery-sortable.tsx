import React, { Dispatch, SetStateAction } from "react";
import { ReactSortable } from "react-sortablejs";
import { Image as TypeImage } from "@prisma/client";
import {
    Button,
    ButtonGroup,
    Card,
    Image,
    ScrollShadow,
    useDisclosure,
} from "@nextui-org/react";
import ImageViewer from "./image-viewer";
import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";

const GallerySortable = ({
    gallery,
    setGallery,
}: {
    gallery: TypeImage[];

    setGallery: Dispatch<SetStateAction<TypeImage[]>>;
}) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <>
            <div className="w-full overflow-x-auto custom-scrollbar">
                <ReactSortable
                    list={gallery}
                    setList={setGallery}
                    className="flex  w-full   gap-4"
                >
                    {gallery.map((item, index) => {
                        return (
                            <Card
                                key={item.public_id}
                                shadow="none"
                                className="w-1/4 mb-4 flex-[0_0_auto]"
                                isPressable
                                onPress={onOpen}
                            >
                                <div className="relative">
                                    <Image
                                        alt={item.public_id}
                                        src={item.url}
                                        className="rounded-bl-none rounded-br-none"
                                    />

                                    {index === 0 && (
                                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-10 ">
                                            <p className="text-xs font-semibold text-warning-200 pointer-events-none">
                                                -Main-
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        );
                    })}
                </ReactSortable>
            </div>
            <ImageViewer
                images={gallery}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            />
        </>
    );
};

export default GallerySortable;
