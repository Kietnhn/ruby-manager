"use client";

import { useAppSelector } from "@/lib/store";

export default function OrderSteps() {
    const steps = ["order", "checkout"];
    const { currentStep } = useAppSelector((store) => store.order);
    return (
        <div className="max-w-full w-[800px] mx-auto">
            <ul
                aria-label="Steps"
                className="items-center text-gray-600 md:flex"
            >
                {steps.map((item, idx) => (
                    <li className="flex-1 flex md:items-center" key={item}>
                        <div
                            className={`flex-1 flex items-center gap-x-3 md:block ${
                                idx != 0 ? "md:space-x-10" : ""
                            }`}
                        >
                            <span
                                className={`block h-24 w-1 md:w-full md:h-1 ${
                                    currentStep >= idx
                                        ? "bg-indigo-600"
                                        : "bg-gray-200"
                                }`}
                            ></span>
                            <div className="md:mt-2">
                                <p
                                    className={`text-sm ${
                                        currentStep >= idx
                                            ? "text-indigo-600"
                                            : ""
                                    }`}
                                >
                                    Step {idx + 1}
                                </p>
                                <h3 className="mt-1 font-medium capitalize">
                                    {item}
                                </h3>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
