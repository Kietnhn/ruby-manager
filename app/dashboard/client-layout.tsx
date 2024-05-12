"use client";

import { setNotifications } from "@/features/notification-slice";
import { getInternalNotifications } from "@/lib/actions/notification";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import clsx from "clsx";
import { useEffect } from "react";
const THREE_MINUTES = 3 * 60 * 1000;
export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isShowAsideMenu } = useAppSelector((store) => store.setting);
    const dispatch = useAppDispatch();
    const delayedCallback = async () => {
        console.log("Callback executed after 10 s");
        const internalNotifications = await getInternalNotifications();
        dispatch(setNotifications(internalNotifications));
    };
    useEffect(() => {
        delayedCallback();
    }, []);
    useEffect(() => {
        const timeoutId = setInterval(delayedCallback, THREE_MINUTES);

        return () => clearInterval(timeoutId);
    }, []);

    return (
        <div
            className={clsx("flex-1 flex flex-col ml-16", {
                "!ml-60": isShowAsideMenu,
            })}
        >
            {children}
        </div>
    );
}
