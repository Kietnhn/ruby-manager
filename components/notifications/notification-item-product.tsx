"use client";
import { IInternalNotification } from "@/lib/definitions";
import { Image, ListboxItem } from "@nextui-org/react";
import React from "react";

const NotificationItemProduct = ({
    notification,
}: {
    notification: IInternalNotification;
}) => {
    const { product, content } = notification;
    return (
        <ListboxItem key={notification.id}>
            <div className="flex flex-row justify-between items-center">
                <Image
                    alt={product?.gallery[0].image}
                    className="w-14 h-14 object-cover"
                    src={product?.gallery[0].image}
                />
                <div className="flex flex-col">
                    <strong className="text-small max-w-52 line-clamp-1 overflow-hidden">
                        {content}
                    </strong>
                </div>
            </div>
        </ListboxItem>
    );
};

export default NotificationItemProduct;
