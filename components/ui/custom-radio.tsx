import {
    RadioGroup,
    Radio,
    useRadio,
    VisuallyHidden,
    RadioProps,
    cn,
} from "@nextui-org/react";

export default function CustomRadio(props: RadioProps) {
    const {
        Component,
        children,
        isSelected,
        description,
        classNames,
        isDisabled,
        getBaseProps,
        getWrapperProps,
        getInputProps,
        getLabelProps,
        getLabelWrapperProps,
        getControlProps,
    } = useRadio(props);

    return (
        <Component
            {...getBaseProps()}
            className={cn(
                "group inline-flex items-center justify-between hover:bg-content2 ",
                " cursor-pointer border-2 border-default rounded-lg px-3 py-2",
                "data-[selected=true]:border-primary",
                classNames?.label,
                isDisabled && "bg-content2 !cursor-default"
            )}
        >
            <VisuallyHidden>
                <input {...getInputProps()} />
            </VisuallyHidden>
            {/* <span {...getWrapperProps()}>
                <span {...getControlProps()} />
            </span> */}
            <div {...getLabelWrapperProps()} className="m-0">
                {children && <span {...getLabelProps()}>{children}</span>}
                {description && (
                    <span className="text-small text-foreground opacity-70 capitalize">
                        {description}
                    </span>
                )}
            </div>
        </Component>
    );
}
