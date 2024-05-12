"use client";

import { DEFAULT_LOCALE } from "@/lib/constants";
import { DatePicker, DatePickerProps, cn } from "@nextui-org/react";
import { I18nProvider } from "@react-aria/i18n";

interface Props extends DatePickerProps {
    wrapper?: string;
    name: string;
    errorMessage?: string;
}
export default function DefaultDatePicker(props: Props) {
    const {
        wrapper,
        name,
        errorMessage,
        labelPlacement = "outside",
        variant = "bordered",
        label = name,
        ...rest
    } = props;
    return (
        <div className={cn(wrapper)}>
            <I18nProvider locale={DEFAULT_LOCALE}>
                <DatePicker
                    labelPlacement={labelPlacement}
                    name={name}
                    label={label}
                    variant={variant}
                    hideTimeZone
                    showMonthAndYearPickers
                    granularity="second"
                    suppressHydrationWarning
                    classNames={{
                        label: "capitalize",
                        inputWrapper: cn(!!errorMessage && "border-red-500"),
                        description: cn(!!errorMessage && "hidden"),
                    }}
                    color={!!errorMessage ? "danger" : "default"}
                    {...rest}
                />
                {!!errorMessage && (
                    <p className="text-xs text-red-500">{errorMessage}</p>
                )}
            </I18nProvider>
        </div>
    );
}
