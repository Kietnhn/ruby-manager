"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Card, Tooltip } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { LinkType } from "@/lib/definitions";
import { ASIDE_MENU_LINKS, FLAT_ASIDE_MENU_LINKS } from "@/lib/constants";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function NavLinks({ isOpen }: { isOpen: boolean }) {
    const [menu, setMenu] = useState<LinkType[]>(
        isOpen ? ASIDE_MENU_LINKS : FLAT_ASIDE_MENU_LINKS
    );
    useEffect(() => {
        if (isOpen) {
            setMenu(ASIDE_MENU_LINKS);
        } else {
            setMenu(FLAT_ASIDE_MENU_LINKS);
        }
    }, [isOpen]);
    return (
        <ul>
            {menu.map((link) => (
                <LinkItem link={link} isOpenMenu={isOpen} key={link.name} />
            ))}
        </ul>
    );
}
function LinkItem({
    link,
    isOpenMenu,
}: {
    link: LinkType;
    isOpenMenu: boolean;
}) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const LinkIcon = link.icon;
    const pathname = usePathname();
    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <>
            <CustomLinkTag
                link={link}
                className={clsx(
                    "flex  grow items-center justify-center gap-2 rounded-md w-full p-3 text-sm font-medium hover:bg-gray-200 hover:text-black md:flex-none md:justify-start md:p-2 md:px-3",
                    {
                        "bg-gray-200 text-black": pathname === link.href,
                        "md:justify-center md:py-2 md:px-2": !isOpenMenu,
                    }
                )}
                onClick={toggleOpen}
            >
                {isOpenMenu ? (
                    <div className="flex gap-2">
                        <LinkIcon className="w-6" />
                        <p className="hidden md:block">{link.name}</p>
                    </div>
                ) : (
                    <Tooltip
                        content={link.name}
                        placement="right-start"
                        showArrow
                    >
                        <LinkIcon className="w-6" />
                    </Tooltip>
                )}
                {link.sublinks.length > 0 && (
                    <ChevronDownIcon
                        className={`w-5 h-5 ${
                            isOpen && "rotate-180"
                        } duration-200`}
                    />
                )}
            </CustomLinkTag>

            {link.sublinks.length > 0 && (
                <div
                    className={`  transition-max-height duration-300 overflow-hidden ${
                        isOpen ? "max-h-screen  px-4" : "max-h-0"
                    }`}
                >
                    {link.sublinks.map((linksub) => (
                        <LinkItem
                            link={linksub}
                            isOpenMenu={isOpenMenu}
                            key={linksub.name}
                        />
                    ))}
                </div>
            )}
        </>
    );
}
function CustomLinkTag({
    link,
    children,
    className,
    onClick,
}: {
    link: LinkType;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}) {
    if (!!link.href) {
        return (
            <Card
                shadow="none"
                isPressable
                className={clsx("", {
                    "bg-transparent flex flex-row w-full md:justify-between rounded-md":
                        true,
                })}
            >
                <Link href={link.href} className={className}>
                    {children}
                </Link>
            </Card>
        );
    } else {
        return (
            <Card
                shadow="none"
                isPressable
                onPress={onClick}
                className={clsx(className, {
                    "bg-transparent flex flex-row w-full md:justify-between rounded-md":
                        true,
                })}
            >
                {children}
            </Card>
        );
    }
}
