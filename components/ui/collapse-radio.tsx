import React from "react";
import {
    RadioGroup,
    Radio,
    useRadio,
    VisuallyHidden,
    RadioProps,
    cn,
    Card,
} from "@nextui-org/react";
import clsx from "clsx";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
interface props extends RadioProps {
    title?: string;
}
export const CollapseRadio = (props: props) => {
    const {
        Component,
        classNames,
        children,
        isSelected,
        description,
        getBaseProps,
        getWrapperProps,
        getInputProps,
        getLabelProps,
        getLabelWrapperProps,
        getControlProps,
    } = useRadio(props);
    const { title } = props;
    return (
        <div className="w-full rounded-lg overflow-hidden">
            <Component
                {...getBaseProps()}
                className={cn(
                    "group inline-flex items-center justify-between hover:bg-content2 flex-row",
                    "w-full cursor-pointer border-2 border-default rounded-lg gap-4 p-4",
                    "data-[selected=true]:border-primary",
                    classNames?.base
                )}
            >
                <VisuallyHidden>
                    <input {...getInputProps()} />
                </VisuallyHidden>

                <div className="w-full cursor-pointer py-2 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <h4
                            className={`font-semibold  text-medium capitalize ${
                                isSelected ? "text-primary" : "text-foreground"
                            }`}
                        >
                            {title}
                        </h4>

                        <span
                            className={`${
                                isSelected ? "text-primary" : "text-foreground"
                            } capitalize`}
                        >
                            {description}
                        </span>
                    </div>
                    <ChevronDownIcon
                        className={`h-5 w-5 transition-transform duration-300 transform ${
                            isSelected ? "rotate-180" : ""
                        }`}
                    />
                </div>
            </Component>

            <div
                className={`  transition-max-height duration-300 overflow-hidden   ${
                    isSelected ? "max-h-screen py-2 p-4" : "max-h-0 p-0"
                }`}
            >
                {children}
            </div>
        </div>
    );
};
