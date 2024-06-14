"use client";

import { RadioGroup, RadioGroupProps, cn } from "@nextui-org/react";

interface Props extends RadioGroupProps {
    name: string;
    wrapper?: string;
    errorMessage?: string;
}
export default function DefaultRadioGroup(props: Props) {
    const {
        wrapper,
        name,
        errorMessage,

        label = name,
        children,
        ...rest
    } = props;
    return (
        <div className={cn(wrapper)}>
            <RadioGroup
                label={label}
                classNames={{
                    label: "capitalize",
                    base: cn(
                        !!errorMessage ? "text-red-500" : "text-foreground"
                    ),
                    description: cn(!!errorMessage && "hidden"),
                }}
                color={!!errorMessage ? "danger" : "default"}
                name={name}
                {...rest}
            >
                {children}
            </RadioGroup>
            {!!errorMessage && (
                <p className="text-xs text-red-500">{errorMessage}</p>
            )}
        </div>
    );
}
