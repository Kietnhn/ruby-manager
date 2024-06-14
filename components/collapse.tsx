"use client";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { cn } from "@nextui-org/react";
import { useState } from "react";

const Collapse = ({
    title,
    children,
    initState = false,
    isBordered = true,
}: {
    title: React.ReactNode;
    children: React.ReactNode;
    initState?: boolean;
    isBordered?: boolean;
}) => {
    const [isOpen, setIsOpen] = useState(initState);

    return (
        <div
            className={cn(
                " rounded-lg overflow-hidden",
                isBordered && "border"
            )}
        >
            <div
                className={cn(
                    " cursor-pointer py-2 px-4  flex justify-between gap-4 items-center",
                    isBordered && "border-b"
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                {title}
                <ChevronDownIcon
                    className={`h-5 w-5 transition-transform duration-300 transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </div>
            <div
                className={`  transition-max-height duration-300 overflow-hidden ${
                    isOpen ? "max-h-full py-2 px-4" : "max-h-0"
                }`}
            >
                {children}
            </div>
        </div>
    );
};

export default Collapse;
