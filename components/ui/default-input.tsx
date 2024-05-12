"use client";

import { Input, InputProps, cn } from "@nextui-org/react";

interface Props extends InputProps {
    name: string;
    wrapper?: string;
    errorMessage?: string;
}
export default function DefaultInput(props: Props) {
    const {
        wrapper,
        name,
        errorMessage,
        labelPlacement = "outside",
        variant = "bordered",
        placeholder = `Enter ${props.name}`,
        label = name,
        ...rest
    } = props;
    return (
        <div className={cn(wrapper)}>
            <Input
                labelPlacement={labelPlacement}
                variant={variant}
                placeholder={placeholder}
                label={label}
                classNames={{
                    label: "capitalize",
                    inputWrapper: cn(!!errorMessage && "border-red-500"),
                    description: cn(!!errorMessage && "hidden"),
                }}
                color={!!errorMessage ? "danger" : "default"}
                name={name}
                {...rest}
            />
            {!!errorMessage && (
                <p className="text-xs text-red-500">{errorMessage}</p>
            )}
        </div>
    );
}
