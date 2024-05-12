"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
} from "@nextui-org/react";
import { PlusIcon } from "@heroicons/react/24/outline";

const ModalAddProperty = ({
    properties,
    setProperties,
}: {
    properties: Object;
    setProperties: Dispatch<SetStateAction<Object>>;
}) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [nameProperty, setNameProperty] = useState<string>("");
    const handleAddProperty = (onClose: () => void) => {
        setProperties({
            [nameProperty]: "",
        });
        onClose();
    };
    return (
        <>
            <Button color="primary" size="sm" onClick={onOpen}>
                <PlusIcon className="w-5 h-6" /> New
            </Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Modal Title
                            </ModalHeader>
                            <ModalBody>
                                <Input
                                    type="tmp"
                                    label="Name property"
                                    placeholder="Enter name property"
                                    name="nameProperty"
                                    onChange={(e) =>
                                        setNameProperty(e.target.value)
                                    }
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={() => handleAddProperty(onClose)}
                                >
                                    Submit
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default ModalAddProperty;
