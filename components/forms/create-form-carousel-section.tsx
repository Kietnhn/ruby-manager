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
import { TSectionSource, TSectionState } from "@/lib/definitions";
import { createCarouselSection } from "@/lib/actions/section";

export default function CreateSectionCarouselForm() {
    const [sources, setSources] = useState<TSectionSource[]>([
        {
            id: uuid(),
            description: "",
            href: "",
            name: "New Item",
            url: "",
        },
    ]);
    const [sectionState, setSectionState] = useState<TSectionState>({
        description: "",
        handle: "",
        title: "",
    });
    const [sourceId, setSourceId] = useState<string>("");
    const [isShowPreview, setIsShowPreview] = useState<boolean>(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    // dispatch
    const createCarouselSectionWithData = createCarouselSection.bind(null, {
        ...sectionState,
        sources,
    });
    const initialState = { message: null, errors: {} };
    const [state, dispatch] = useFormState(
        // @ts-ignore
        createCarouselSectionWithData,
        // @ts-ignore
        initialState
    );

    // functions
    const handleSelectedImagesChange = (images: TypeImage[]) => {
        if (images.length <= 0) return;
        const newSources = sources.map((source) =>
            source.id === sourceId
                ? { ...source, url: images[0].url }
                : { ...source }
        );
        console.log(images);
        setSources(newSources);
    };
    const handleSelectSource = (sourceId: string) => {
        setSourceId(sourceId);
        onOpen();
    };
    const handleAddItem = () => {
        let newId = uuid();
        const sourceIds = sources.map((source) => source.id);
        while (sourceIds.includes(newId)) {
            newId = uuid();
        }
        const newSource: TSectionSource = {
            description: "",
            href: "",
            name: "New Item",
            url: "",
            id: newId,
        };
        setSources([...sources, newSource]);
    };
    const handleChange = (
        e: ChangeEvent<HTMLInputElement>,
        sourceId: string
    ) => {
        const name = e.target.name as keyof (typeof sources)[0];
        const value = e.target.value;
        const newSources: TSectionSource[] = sources.map((source) =>
            source.id === sourceId
                ? { ...source, [name]: value }
                : { ...source }
        );
        setSources(newSources);
    };
    const handleDeleteItem = (sourceId: string) => {
        const newSources: TSectionSource[] = sources.filter(
            (source) => source.id !== sourceId
        );
        setSources(newSources);
    };
    const handleClose = (onClose: () => void) => {
        setSourceId("");
        onClose();
    };
    const handleChangeSectionState = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name as keyof typeof sectionState;
        const value = e.target.value;
        if (!value) return;
        setSectionState({ ...sectionState, [name]: value });
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-semibold">
                    {isShowPreview
                        ? "Preview carousel section"
                        : "Create carousel section form"}
                </h2>
                <Switch
                    size="lg"
                    isSelected={isShowPreview}
                    onValueChange={setIsShowPreview}
                    isDisabled={!sectionState.title || sources.length === 0}
                    startContent={<EyeIcon className="w-5 h-5" />}
                    endContent={<EyeSlashIcon className="w-5 h-5" />}
                >
                    Preview
                </Switch>
            </div>

            {isShowPreview ? (
                <PreviewSectionCarousel
                    sectionState={sectionState}
                    sources={sources}
                />
            ) : (
                <form action={dispatch}>
                    <div className="flex flex-col gap-4">
                        <DefaultInput
                            value={sectionState.handle}
                            onChange={handleChangeSectionState}
                            name="handle"
                            description="This field is used to identify the calling route"
                            wrapper="w-1/2"
                            placeholder="/shop/a"
                            errorMessage={state?.errors.handle?._errors.at(0)}
                        />
                        <DefaultInput
                            value={sectionState.title}
                            onChange={handleChangeSectionState}
                            name="title"
                            wrapper="w-1/2"
                            errorMessage={state?.errors.title?._errors.at(0)}
                        />
                        <DefaultInput
                            value={sectionState.description || ""}
                            onChange={handleChangeSectionState}
                            name="description"
                            label="Description (Optional)"
                            wrapper="w-1/2"
                        />
                        <div className="w-full flex justify-end items-center">
                            <Button
                                color="primary"
                                onClick={handleAddItem}
                                type="button"
                            >
                                <PlusIcon className="w-5 h-5" />
                                Add new item
                            </Button>
                        </div>
                        <div className="overflow-x-auto custom-scrollbar pb-2">
                            <Reorder.Group
                                axis="x"
                                className=" grid grid-flow-col auto-cols-[50%] gap-4 lg:auto-cols-[25%] md:auto-cols-[33.33%]"
                                values={sources}
                                onReorder={setSources}
                            >
                                {sources.map((source, index) => (
                                    <SourceItem key={source.id} source={source}>
                                        <Card
                                            className="shadow-none hover:shadow-medium "
                                            key={source.id}
                                        >
                                            <Card
                                                shadow="none"
                                                isPressable
                                                onPress={() =>
                                                    handleSelectSource(
                                                        source.id
                                                    )
                                                }
                                                className="rounded-b-none "
                                            >
                                                <Image
                                                    classNames={{
                                                        wrapper:
                                                            "aspect-square rounded-medium rounded-b-none !max-w-full w-full bg-center bg-cover",
                                                    }}
                                                    className="!max-w-full w-full h-full object-cover rounded-medium rounded-b-none"
                                                    src={source.url}
                                                    fallbackSrc={NoImageSrc.src}
                                                    alt={source.name || ""}
                                                />
                                                {state?.errors.sources?.[
                                                    index
                                                ]?.url?._errors.at(0) && (
                                                    <p className="text-red-500 text-xs">
                                                        {state?.errors.sources?.[
                                                            index
                                                        ]?.url?._errors.at(0)}
                                                    </p>
                                                )}
                                            </Card>
                                            <CardBody className=" flex flex-col gap-2 items-start">
                                                <DefaultInput
                                                    name="name"
                                                    value={source.name || ""}
                                                    wrapper="w-full"
                                                    onChange={(e) =>
                                                        handleChange(
                                                            e,
                                                            source.id
                                                        )
                                                    }
                                                    errorMessage={state?.errors.sources?.[
                                                        index
                                                    ]?.name?._errors.at(0)}
                                                />

                                                <DefaultInput
                                                    name="description"
                                                    defaultValue={
                                                        source.description || ""
                                                    }
                                                    wrapper="w-full"
                                                    onChange={(e) =>
                                                        handleChange(
                                                            e,
                                                            source.id
                                                        )
                                                    }
                                                />
                                                <DefaultInput
                                                    name="href"
                                                    defaultValue={source.href}
                                                    description="Link url to navigate when clicked item"
                                                    wrapper="w-full"
                                                    onChange={(e) =>
                                                        handleChange(
                                                            e,
                                                            source.id
                                                        )
                                                    }
                                                    errorMessage={state?.errors.sources?.[
                                                        index
                                                    ]?.href?._errors.at(0)}
                                                />
                                            </CardBody>
                                            <CardFooter className="">
                                                <Popover
                                                    placement="bottom"
                                                    showArrow={true}
                                                >
                                                    <PopoverTrigger>
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                        >
                                                            <EllipsisHorizontalIcon className="w-5 h-5" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent>
                                                        <Button
                                                            className="w-full"
                                                            color="danger"
                                                            variant="bordered"
                                                            onClick={() =>
                                                                handleDeleteItem(
                                                                    source.id
                                                                )
                                                            }
                                                        >
                                                            <TrashIcon className="w-5 h-5" />
                                                            Delete
                                                        </Button>
                                                    </PopoverContent>
                                                </Popover>
                                            </CardFooter>
                                        </Card>
                                    </SourceItem>
                                ))}
                            </Reorder.Group>
                        </div>
                        {state?.message && (
                            <p className="text-red-500">{state.message}</p>
                        )}
                        {/* {JSON.stringify(state?.errors)} */}
                        <CreateButton />
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
                                    Add
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
function SourceItem({
    source,
    children,
}: {
    source: TSectionSource;
    children: ReactNode;
}) {
    const controls = useDragControls();

    return (
        <Reorder.Item
            value={source}
            dragListener={false}
            dragControls={controls}
            className="relative"
        >
            <div className="absolute bottom-3 right-3 z-10">
                <Tooltip content="Drag to reorder">
                    <Button
                        isIconOnly
                        onPointerDown={(e) => controls.start(e)}
                        size="sm"
                    >
                        <GripIcon className="w-5 h-5" />
                    </Button>
                </Tooltip>
            </div>

            {children}
        </Reorder.Item>
    );
}
function PreviewSectionCarousel({
    sectionState,
    sources,
}: {
    sectionState: TSectionState;
    sources: SectionSource[];
}) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <section>
                <div className="flex justify-between items-center mb-6">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-2xl font-semibold capitalize">
                            {sectionState.title}
                        </h3>
                        {sectionState.description && (
                            <p>{sectionState.description}</p>
                        )}
                    </div>
                </div>
                <div className="overflow-x-auto custom-scrollbar pb-2">
                    <div className=" grid grid-flow-col auto-cols-[50%] gap-4 lg:auto-cols-[25%] md:auto-cols-[33.33%]">
                        {sources.map((source, index) => (
                            <Card
                                key={index}
                                isPressable
                                className="shadow-none hover:shadow-md"
                                as={Link}
                                href={source.href}
                            >
                                <Image
                                    classNames={{
                                        wrapper:
                                            "aspect-square rounded-medium rounded-b-none !max-w-full w-full bg-center bg-cover",
                                    }}
                                    className="!max-w-full w-full h-full object-cover rounded-medium rounded-b-none"
                                    src={source.url}
                                    fallbackSrc={NoImageSrc.src}
                                    alt={source.name || ""}
                                />
                                <CardBody className=" flex flex-row justify-between items-center">
                                    <div className="h-full flex items-start justify-start flex-col w-4/5">
                                        <strong className="line-clamp-1">
                                            {source.name}
                                        </strong>
                                        <p className="text-small text-foreground-500">
                                            {source.description}
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </motion.div>
    );
}
