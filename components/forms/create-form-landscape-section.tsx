"use client";

import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Image,
    Link,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Switch,
    Tooltip,
    useDisclosure,
} from "@nextui-org/react";
import DefaultInput from "../ui/default-input";
import { ChangeEvent, ReactNode, useState } from "react";
import { SectionSource } from "@prisma/client";
import NoImageSrc from "@/public/no-image.jpg";
import {
    EllipsisHorizontalIcon,
    EyeIcon,
    EyeSlashIcon,
    PlusIcon,
    Squares2X2Icon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { Image as TypeImage } from "@prisma/client";
import StoreImages from "../store-images";
import { Reorder, motion, useDragControls } from "framer-motion";
import { v4 as uuid } from "uuid";
import { GripIcon } from "lucide-react";
import { useFormState, useFormStatus } from "react-dom";
import {
    ISectionLandscapeData,
    TSectionSource,
    TSectionState,
} from "@/lib/definitions";
import { isVideo } from "@/lib/utils";
import { createLandscapeSection } from "@/lib/actions/section";

export default function CreateSectionLandscapeForm() {
    const [sectionState, setSectionState] = useState<ISectionLandscapeData>({
        handle: "",
        description: "",
        subTitle: "",
        title: "",
        source: {
            description: "",
            href: "",
            name: "",
            url: "",
        },
    });
    const [isShowPreview, setIsShowPreview] = useState<boolean>(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const initialState = { message: null, errors: {} };
    // dispatch
    const createLandscapeSectionWithData = createLandscapeSection.bind(
        null,
        sectionState
    );

    const [state, dispatch] = useFormState(
        // @ts-ignore
        createLandscapeSectionWithData,
        // @ts-ignore
        initialState
    );
    const handleClose = (onClose: () => void) => {
        onClose();
    };
    const handleSelectedImagesChange = (images: TypeImage[]) => {
        if (images.length <= 0) return;
        const url = images[0].url;
        // if (!isVideo(url)) {
        //     console.log("invalid url: " + url);

        //     return;
        // }
        setSectionState({
            ...sectionState,
            source: { ...sectionState.source, url: url },
        });
    };
    const handleChangeSectionState = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name as keyof typeof sectionState;
        const value = e.target.value;
        setSectionState({
            ...sectionState,
            [name]: value,
        });
    };

    console.log(sectionState);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-semibold">
                    {isShowPreview
                        ? "Preview landscape section"
                        : "Create landscape section form"}
                </h2>
                <Switch
                    size="lg"
                    isSelected={isShowPreview}
                    onValueChange={setIsShowPreview}
                    startContent={<EyeIcon className="w-5 h-5" />}
                    endContent={<EyeSlashIcon className="w-5 h-5" />}
                >
                    Preview
                </Switch>
            </div>

            {isShowPreview ? (
                <PreviewSectionLandscape sectionState={sectionState} />
            ) : (
                <form action={dispatch}>
                    <div className="flex gap-4 flex-nowrap items-center">
                        <div className="w-1/3 flex flex-col gap-4">
                            <DefaultInput
                                value={sectionState.handle || ""}
                                onChange={handleChangeSectionState}
                                name="handle"
                                description="This field is used to identify the calling route"
                                wrapper="w-full"
                                placeholder="/shop/a"
                                errorMessage={state?.errors.handle?._errors.at(
                                    0
                                )}
                            />
                            <DefaultInput
                                value={sectionState.subTitle || ""}
                                onChange={handleChangeSectionState}
                                name="subTitle"
                                label="Sub Title"
                                wrapper="w-full"
                                errorMessage={state?.errors.subTitle?._errors.at(
                                    0
                                )}
                            />
                            <DefaultInput
                                value={sectionState.title || ""}
                                onChange={handleChangeSectionState}
                                name="title"
                                wrapper="w-full"
                                errorMessage={state?.errors.title?._errors.at(
                                    0
                                )}
                            />
                            <DefaultInput
                                value={sectionState.description || ""}
                                onChange={handleChangeSectionState}
                                name="description"
                                label="Description (Optional)"
                                wrapper="w-full"
                            />
                            <DefaultInput
                                value={sectionState.source.href || ""}
                                onChange={(e) =>
                                    setSectionState({
                                        ...sectionState,
                                        source: {
                                            ...sectionState.source,
                                            href: e.target.value,
                                        },
                                    })
                                }
                                name="href"
                                wrapper="w-full"
                                description="The link to navigate when clicked"
                                errorMessage={state?.errors.source?.href?._errors.at(
                                    0
                                )}
                            />
                            <CreateButton />
                        </div>
                        <div className="w-2/3">
                            <Card
                                isPressable
                                shadow="none"
                                onPress={onOpen}
                                className="w-full group"
                            >
                                <div className="w-full aspect-video">
                                    {sectionState.source.url ? (
                                        <>
                                            {isVideo(
                                                sectionState.source.url
                                            ) ? (
                                                <video
                                                    src={
                                                        sectionState.source.url
                                                    }
                                                    autoPlay
                                                    preload="auto"
                                                    loop
                                                    className="w-full h-full"
                                                ></video>
                                            ) : (
                                                <Image
                                                    src={
                                                        sectionState.source.url
                                                    }
                                                    alt={sectionState.title}
                                                />
                                            )}
                                        </>
                                    ) : (
                                        <div className="w-full h-full bg-default-300 relative group-hover:bg-default-200 duration-150">
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                                <PlusIcon className="w-20 h-20" />
                                            </div>
                                        </div>
                                    )}
                                    {state?.errors.source?.url?._errors.at(
                                        0
                                    ) && (
                                        <p className="text-red-500 text-xs">
                                            {state?.errors.source?.url?._errors.at(
                                                0
                                            )}
                                        </p>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>
                </form>
            )}

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="2xl"
                placement="center"
                scrollBehavior={"inside"}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1"></ModalHeader>
                            <ModalBody>
                                <StoreImages
                                    selectMode="single"
                                    onSelectedImagesChange={
                                        handleSelectedImagesChange
                                    }
                                />
                            </ModalBody>

                            <ModalFooter>
                                <Button
                                    color="primary"
                                    onPress={() => handleClose(onClose)}
                                >
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
function CreateButton() {
    const { pending } = useFormStatus();
    return (
        <Button
            className="w-full"
            color="primary"
            type="submit"
            isDisabled={pending}
        >
            Create
        </Button>
    );
}
// function SourceItem({
//     source,
//     children,
// }: {
//     source: TSectionSource;
//     children: ReactNode;
// }) {
//     const controls = useDragControls();

//     return (
//         <Reorder.Item
//             value={source}
//             dragListener={false}
//             dragControls={controls}
//             className="relative"
//         >
//             <div className="absolute bottom-3 right-3 z-10">
//                 <Tooltip content="Drag to reorder">
//                     <Button
//                         isIconOnly
//                         onPointerDown={(e) => controls.start(e)}
//                         size="sm"
//                     >
//                         <GripIcon className="w-5 h-5" />
//                     </Button>
//                 </Tooltip>
//             </div>

//             {children}
//         </Reorder.Item>
//     );
// }
function PreviewSectionLandscape({
    sectionState,
}: {
    sectionState: ISectionLandscapeData;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <section className="flex-center flex-col gap-6">
                <div className="flex-center flex-col ">
                    <p className="font-semibold">{sectionState.subTitle}</p>
                    <h2 className="text-7xl font-bold">{sectionState.title}</h2>
                    <p className="text-foreground-500">
                        {sectionState.description}
                    </p>
                </div>
                <div className="overflow-x-auto custom-scrollbar pb-2">
                    <div className="w-full aspect-video">
                        {isVideo(sectionState.source.url) ? (
                            <video
                                src={sectionState.source.url}
                                autoPlay
                                preload="auto"
                                loop
                                className="w-full h-full"
                            ></video>
                        ) : (
                            <Image
                                src={sectionState.source.url}
                                alt={sectionState.title}
                            />
                        )}
                    </div>
                </div>
            </section>
        </motion.div>
    );
}
