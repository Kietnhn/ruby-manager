"use client";

import { UserNoPassword } from "@/lib/definitions";
import { BuildingStorefrontIcon } from "@heroicons/react/24/outline";
import {
    Avatar,
    Badge,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Link,
    Navbar,
    NavbarContent,
    NavbarItem,
    Tooltip,
} from "@nextui-org/react";
import { usePathname } from "next/navigation";
import Notifications from "../notifications";
export default function MainNav({ user }: { user: UserNoPassword }) {
    const pathname = usePathname();
    return (
        <Navbar maxWidth="full" position="sticky" isBordered shouldHideOnScroll>
            {pathname === "/dashboard" && (
                <NavbarContent className="hidden sm:flex gap-4" justify="start">
                    <NavbarItem>
                        <h2 className="text-2xl font-semibold">
                            Welcome back {user.name as string}!
                        </h2>
                        <p className="text-default-500">
                            Here what happening with your store today
                        </p>
                    </NavbarItem>
                </NavbarContent>
            )}
            <NavbarContent
                className="hidden sm:flex gap-4"
                justify="center"
            ></NavbarContent>

            <NavbarContent as="div" justify="end">
                <NavbarItem>
                    <Tooltip content="Move to shop">
                        <Button
                            as={Link}
                            href={process.env.SHOP_URL}
                            isIconOnly
                            radius="full"
                            variant="light"
                        >
                            <BuildingStorefrontIcon className="w-5 h-5" />
                        </Button>
                    </Tooltip>
                </NavbarItem>
                <NavbarItem>
                    <Notifications />
                </NavbarItem>
                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <Avatar
                            as="button"
                            className="transition-transform"
                            name={user.name || user.firstName || ""}
                            size="sm"
                            src={user.image || undefined}
                        />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                        <DropdownItem key="settings">My Settings</DropdownItem>
                        <DropdownItem key="team_settings">
                            Team Settings
                        </DropdownItem>
                        <DropdownItem key="analytics">Analytics</DropdownItem>
                        <DropdownItem key="system">System</DropdownItem>
                        <DropdownItem key="configurations">
                            Configurations
                        </DropdownItem>
                        <DropdownItem key="help_and_feedback">
                            Help & Feedback
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>
        </Navbar>
    );
}
