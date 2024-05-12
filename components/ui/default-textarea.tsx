"use client";

import { TextAreaProps, Textarea, cn } from "@nextui-org/react";

interface Props extends TextAreaProps {
    name: string;
    wrapper?: string;
    errorMessage?: string;
    rows?: number;
}
export default function DefaultTextArea(props: Props) {
    const {
        rows = 2,
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
            <Textarea
                rows={rows}
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
