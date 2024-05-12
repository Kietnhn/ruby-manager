"use client";

import {
    AdjustmentsHorizontalIcon,
    BellIcon,
    UserIcon,
} from "@heroicons/react/24/outline";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { ShieldIcon, SquarePlusIcon } from "lucide-react";

export default function MenuSettings() {
    return (
        <Listbox
            aria-label="menuSettings"
            label="Menu Settings"
            // onAction={(key) => alert(key)}
        >
            <ListboxItem
                key="general"
                startContent={
                    <AdjustmentsHorizontalIcon className={"w-5 h-5"} />
                }
                href="/dashboard/settings/general"
            >
                General
            </ListboxItem>
            <ListboxItem
                key="profile"
                startContent={<UserIcon className="w-5 h-5" />}
            >
                Profile
            </ListboxItem>
            <ListboxItem
                key="notifications"
                startContent={<BellIcon className="w-5 h-5" />}
            >
                Notifications
            </ListboxItem>
            <ListboxItem
                key="security"
                startContent={<ShieldIcon className="w-5 h-5" />}
            >
                Security
            </ListboxItem>
            <ListboxItem
                key="other"
                startContent={<SquarePlusIcon className="w-5 h-5" />}
            >
                Other
            </ListboxItem>
        </Listbox>
    );
}
