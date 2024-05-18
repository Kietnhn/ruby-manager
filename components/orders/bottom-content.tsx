"use client";
import { setCurrentStep } from "@/features/order-slice";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    Button,
} from "@nextui-org/react";
export default function BottomContent() {
    const { cart, currentStep } = useAppSelector((store) => store.order);
    const dispatch = useAppDispatch();
    const handleNextStep = () => {
        dispatch(setCurrentStep(currentStep + 1));
    };
    const handlePrevStep = () => {
        if (currentStep === 0) return;

        dispatch(setCurrentStep(currentStep - 1));
    };
    return (
        <Navbar className="fixed bottom-0 top-[unset]">
            <NavbarContent
                className="hidden sm:flex gap-4 w-full"
                justify="center"
            >
                <Button onClick={handlePrevStep}>Prev step</Button>
                Current step {currentStep}
                {currentStep < 3 && (
                    <Button onClick={handleNextStep} color="primary">
                        Next step
                    </Button>
                )}
            </NavbarContent>
        </Navbar>
    );
}
