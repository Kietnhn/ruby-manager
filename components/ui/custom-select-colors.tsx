"use client";
import ReactSelect, { MultiValue, Props } from "react-select";
const customStyles = {
    control: (provided: any, state: any) => ({
        ...provided,
        borderWidth: "2px ",
        borderRadius: "12px",
        borderTopRightRadius: "0",
        borderBottomRightRadius: "0",
        outline: "none",
        boxShadow: "none",
        minHeight: "2.5rem",
        "&:hover": {
            borderColor: "unset",
        },
    }),
    placeholder: (provided: any) => ({
        ...provided,
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
    }),
    input: (provided: any) => ({
        ...provided,
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
    }),
    menu: (provided: any) => ({
        ...provided,
        zIndex: 9999,
    }),
    menuList: (provided: any) => ({
        ...provided,
        padding: "0.5rem ",
        maxHeight: "200px",
        overflowY: "auto",
    }),
    option: (provided: any, state: any) => ({
        ...provided,
        borderRadius: "8px",
        padding: "0.375rem 0.5rem",
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
        backgroundColor:
            state.isSelected &&
            "hsl(var(--nextui-default) / var(--nextui-default-opacity, var(--tw-bg-opacity)))",
        color:
            state.isSelected &&
            "hsl(var(--nextui-default-foreground) / var(--nextui-default-foreground-opacity, var(--tw-text-opacity)))",
        "&:hover": {
            cursor: "pointer",
            color: "hsl(var(--nextui-default-foreground) / var(--nextui-default-foreground-opacity, var(--tw-text-opacity)))",
            backgroundColor:
                "hsl(var(--nextui-default) / var(--nextui-default-opacity, var(--tw-bg-opacity)))",
        },
    }),
    multiValue: (provided: any) => ({
        ...provided,
        textTransform: "capitalize",
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
    }),
    multiValueLabel: (provided: any) => ({
        ...provided,
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
    }),
    multiValueRemove: (provided: any) => ({
        ...provided,
        "&:hover": {
            backgroundColor: "#e2e8f0",
            color: "#718096",
        },
    }),
    clearIndicator: (provided: any) => ({
        ...provided,
        "&:hover": {
            cursor: " pointer",
        },
    }),
    dropdownIndicator: (provided: any) => ({
        ...provided,
        "&:hover": {
            cursor: " pointer",
        },
    }),
};
interface IProps extends Props {
    label?: string;
    wrapper?: string;
}
export default function CustomSelectSize({ wrapper, label, ...rest }: IProps) {
    return (
        <div className={wrapper}>
            {label && <p className="text-foreground text-small">{label}</p>}
            <ReactSelect
                isMulti
                className="flex-1 "
                styles={customStyles}
                classNamePrefix="select"
                components={{
                    Option: OptionComponent,
                }}
                {...rest}
            />
        </div>
    );
}
const OptionComponent = (props: any) => {
    const { data, innerProps, innerRef } = props;
    return (
        <div
            {...innerProps}
            ref={innerRef}
            className={`flex gap-2 justify-between items-center px-2 py-1.5 
            hover:cursor-pointer hover:bg-hover rounded-small
        `}
        >
            <p className="capitalize text-small">{data.label}</p>
            <div
                className="w-4 h-4 rounded-sm"
                style={{
                    backgroundColor: `rgb(${data.color.join(",")})`,
                }}
            ></div>
        </div>
    );
};
