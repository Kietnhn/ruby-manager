"use client";
import Link from "next/link";
import NavLinks from "@/components/dashboard/nav-links";
import { ChevronRightIcon, PowerIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { logOut } from "@/lib/actions/user";
import {
    Button,
    Divider,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Tooltip,
    User,
} from "@nextui-org/react";
import Logo from "../rubylogo";
import clsx from "clsx";
import { UserNoPassword } from "@/lib/definitions";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { setIsShowAsideMenu } from "@/features/setting-slice";
export default function SideNav({ user }: { user: UserNoPassword }) {
    const { isShowAsideMenu } = useAppSelector((store) => store.setting);
    const dispatch = useAppDispatch();
    const contentRef = useRef<HTMLDivElement | null>(null);

    const handleSetIsShowAsideMenu = () => {
        dispatch(setIsShowAsideMenu(!isShowAsideMenu));
    };
    // useEffect(() => {
    //     const contentElement = document.getElementById("content");
    //     if (!contentElement || !contentRef.current) return;
    //     if (isShowAsideMenu) {
    //         contentElement.style.marginLeft = 240 + "px";
    //     } else {
    //         contentElement.style.marginLeft = 64 + "px";
    //     }
    // }, [isShowAsideMenu]);
    return (
        <div
            className="sticky top-0 left-0 z-50 h-screen light:bg-gray-50 dark:bg-content1 shadow-medium"
            ref={contentRef}
        >
            <div className="flex h-full flex-col px-3 py-4 md:px-2 overflow-auto custom-scrollbar">
                <Link
                    className={`mb-2 flex-center  rounded-md ${
                        isShowAsideMenu ? "px-3 !justify-start" : "px-0 "
                    }`}
                    href="#"
                >
                    <div className="  flex-center overflow-hidden">
                        <Logo className="" />
                        <h2
                            className={`text-2xl font-semibold ${
                                isShowAsideMenu ? "ml-1 max-w-full" : "max-w-0"
                            } `}
                        >
                            Ruby
                        </h2>
                    </div>
                </Link>
                <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
                    <NavLinks isOpen={isShowAsideMenu} />
                    <div className="hidden h-auto w-full grow rounded-md  md:block"></div>
                    {/* <Divider /> */}

                    {/* <div className="flex-center">
                        <Dropdown
                            placement="right-end"
                            classNames={{ content: "min-w-[140px]" }}
                        >
                            <DropdownTrigger>
                                <User
                                    className={clsx("overflow-hidden", {
                                        "!px-0 !gap-0": !isShowAsideMenu,
                                    })}
                                    classNames={{
                                        description: !isShowAsideMenu
                                            ? "w-0"
                                            : "",
                                        name: !isShowAsideMenu ? "w-0" : "",
                                    }}
                                    as={"button"}
                                    name={user.name || user.firstName}
                                    description={<p>{user.email}</p>}
                                    avatarProps={{
                                        src: user.image || undefined,
                                    }}
                                />
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Link Actions">
                                <DropdownItem key="logout" color="danger">
                                    <form action={logOut}>
                                        <button
                                            className={clsx(
                                                "flex  w-full grow items-center justify-center gap-2 rounded-md md:flex-none md:justify-start ",
                                                {
                                                    "md:justify-center":
                                                        !isShowAsideMenu,
                                                }
                                            )}
                                        >
                                            <>
                                                <PowerIcon className="w-6" />
                                                <div
                                                    className={`hidden md:block `}
                                                >
                                                    Sign Out
                                                </div>
                                            </>
                                        </button>
                                    </form>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div> */}
                </div>
            </div>
            <div className="absolute right-0 top-[calc((var(--navbar-height))/2)] -translate-y-1/2 translate-x-1/2  hidden md:block z-50">
                <Tooltip content={isShowAsideMenu ? "Hide" : "Show"} showArrow>
                    <Button
                        isIconOnly
                        className="hover:scale-105 rounded-full"
                        size="sm"
                        onClick={handleSetIsShowAsideMenu}
                    >
                        <ChevronRightIcon
                            className={clsx("w-4 h-4 duration-200", {
                                "rotate-180": isShowAsideMenu,
                            })}
                        />
                    </Button>
                </Tooltip>
            </div>
        </div>
    );
}
