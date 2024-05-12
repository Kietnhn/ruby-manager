"use client";
import { setIsShowWarning } from "@/features/product-slice";
import { useAppDispatch } from "@/lib/store";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/react";

export default function NotSetCategoryModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const dispatch = useAppDispatch();
    return (
        <Modal size={"sm"} isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex  gap-1">
                            <span className="text-red-500">Attention:</span>
                            Category Not Set
                        </ModalHeader>
                        <ModalBody>
                            <p>
                                Please note that this product cannot be made
                                available to users until you assign it to a
                                category. Categories help organize products and
                                make them accessible to customers.
                                <strong className="text-red-500">
                                    Without a category, users will not be able
                                    to find or purchase this product.
                                </strong>
                            </p>
                            <p>
                                Please set a category for this product before
                                proceeding.
                            </p>
                            <p>Thank you for your attention to this matter.</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="primary"
                                className="w-full"
                                onPress={() => {
                                    dispatch(setIsShowWarning(false));
                                    onClose();
                                }}
                            >
                                Got it!
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
