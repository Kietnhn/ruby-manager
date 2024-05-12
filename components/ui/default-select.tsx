"use client";

import { Select, SelectProps, cn } from "@nextui-org/react";

interface Props extends SelectProps {
    name: string;
    wrapper?: string;
    errorMessage?: string;
}
export default function DefaultSelect(props: Props) {
    const {
        wrapper,
        name,
        errorMessage,
        labelPlacement = "outside",
        variant = "bordered",
        placeholder = `Select a ${props.name}`,
        label = name,
        children,
        ...rest
    } = props;
    return (
        <div className={cn(wrapper)}>
            <Select
                labelPlacement={labelPlacement}
                variant={variant}
                placeholder={placeholder}
                label={label}
                classNames={{
                    label: "capitalize",
                    mainWrapper: cn(!!errorMessage && "border-red-500"),
                    description: cn(!!errorMessage && "hidden"),
                    value: "capitalize",
                }}
                color={!!errorMessage ? "danger" : "default"}
                name={name}
                {...rest}
            >
                {children}
            </Select>
            {!!errorMessage && (
                <p className="text-xs text-red-500">{errorMessage}</p>
            )}
        </div>
    );
}
