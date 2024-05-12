"use client";

import { Switch, SwitchProps, cn } from "@nextui-org/react";

export default function CustomSwitch(props: SwitchProps) {
    const { children, classNames, ...rest } = props;

    return (
        <Switch
            value={"true"}
            classNames={{
                base: cn(
                    "inline-flex flex-row-reverse w-full max-w-full  bg-content1 hover:bg-content2 items-center",
                    "justify-between cursor-pointer rounded-large gap-2 p-4 border-2 border-transparent",
                    "data-[selected=true]:border-primary",
                    classNames?.base
                ),
                wrapper: "p-0 h-4 overflow-visible",
                thumb: cn(
                    "w-6 h-6 border-2 shadow-lg",
                    "group-data-[hover=true]:border-primary",
                    //selected
                    "group-data-[selected=true]:ml-6",
                    // pressed
                    "group-data-[pressed=true]:w-7",
                    "group-data-[selected]:group-data-[pressed]:ml-4"
                ),
            }}
            defaultValue={"false"}
            {...rest}
        >
            {children}
        </Switch>
    );
}
