"use client";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
    BellIcon,
    CheckIcon,
    PencilIcon,
    ShieldExclamationIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    Card,
    CardBody,
    CardHeader,
    Button,
    cn,
    Listbox,
    ListboxItem,
    Image,
    Checkbox,
    CardFooter,
} from "@nextui-org/react";
import NotificationItemProduct from "./notification-item-product";
import moment from "moment";
import { Key, useMemo, useState } from "react";
import {
    deleteNotifications,
    setIsReadedNotification,
} from "@/lib/actions/notification";
import { usePathname, useRouter } from "next/navigation";
import { CopyCheckIcon } from "lucide-react";
import { IInternalNotification } from "@/lib/definitions";
import { setNotifications } from "@/features/notification-slice";
export default function Notifications() {
    const { notifications } = useAppSelector((store) => store.notification);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [selectDelete, setSelecteDelete] = useState<string[]>([]);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const newNotifications = useMemo(
        () => notifications.filter((notification) => !notification.isReaded),
        [notifications]
    );
    // console.log({ newNotifications, notifications });

    const handleSelectNotification = async (
        notification: IInternalNotification
    ) => {
        await setIsReadedNotification(notification.id);
        // update state manually
        const updated = notifications.map((noti) =>
            noti.id === notification.id ? { ...noti, isReaded: true } : noti
        );
        dispatch(setNotifications(updated));

        if (!notification.product) return;
        router.push(`/dashboard/products/${notification.product.id}/edit`);
    };
    const handleSelectDelete = (deleteId: string) => {
        const existed = selectDelete.includes(deleteId);
        if (existed) {
            const newSelectDelete = selectDelete.filter(
                (item) => item !== deleteId
            );
            setSelecteDelete(newSelectDelete);
        } else {
            const newSelectDelete = [...selectDelete, deleteId];

            setSelecteDelete(newSelectDelete);
        }
    };
    const handleDeleteNotifications = async () => {
        console.log("loading");

        await deleteNotifications(selectDelete);
        console.log("deleted");
        const afterDeleted = notifications.filter(
            (notification) => !selectDelete.includes(notification.id)
        );
        // refesh does not work so we need to update the selecteDelete manually
        dispatch(setNotifications(afterDeleted));
        // reset state
        setSelecteDelete([]);
        setIsEdit(false);
    };

    return (
        <Popover>
            <PopoverTrigger>
                <Button
                    isIconOnly
                    radius="full"
                    variant="light"
                    className="overflow-visible"
                >
                    <BellIcon className="w-5 h-5" />

                    <div
                        className={cn(
                            "absolute top-[5%] right-[5%] flex-center w-5 h-5 border-2 border-background bg-default text-default-foreground text-small rounded-full -translate-y-1/2 translate-x-1/2 ",
                            newNotifications.length > 0 &&
                                "animate-bounce top-0 right-[-5%]"
                        )}
                    >
                        {notifications.length}
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px]">
                <Card
                    shadow="none"
                    className="w-full border-none bg-transparent"
                >
                    <CardHeader className="flex flex-row justify-between items-center">
                        <strong>Notifications</strong>
                        <Button size="sm" onClick={() => setIsEdit(!isEdit)}>
                            {isEdit ? (
                                <>
                                    <CheckIcon className="w-4 h-4" />
                                    Done
                                </>
                            ) : (
                                <>
                                    <PencilIcon className="w-4 h-4" /> Edit
                                </>
                            )}
                        </Button>
                    </CardHeader>
                    <CardBody className="py-0 max-h-[360px] min-h-10 overflow-y-auto">
                        <div className="flex flex-col gap-4">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={cn(
                                        "w-full px-2 py-1.5 flex gap-2 items-center justify-between hover:bg-default cursor-pointer rounded-medium",
                                        isEdit && "hover:bg-[unset!important]"
                                    )}
                                    onClick={() =>
                                        isEdit
                                            ? () => {}
                                            : handleSelectNotification(
                                                  notification
                                              )
                                    }
                                >
                                    <div className="relative">
                                        {isEdit ? (
                                            <>
                                                <Checkbox
                                                    isSelected={selectDelete.includes(
                                                        notification.id
                                                    )}
                                                    onChange={() =>
                                                        handleSelectDelete(
                                                            notification.id
                                                        )
                                                    }
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <BellIcon className="w-5 h-5" />
                                                {/* <div className="w-16 h-16 bg-white rounded-lg shadow-2xl"></div> */}
                                                {!notification.isReaded && (
                                                    <>
                                                        <div className="absolute top-0 right-[5%] -mr-1 -mt-1 w-3 h-3 rounded-full bg-danger-400 animate-ping"></div>
                                                        <div className="absolute top-0 right-[5%] -mr-1 -mt-1 w-3 h-3 rounded-full bg-danger-400"></div>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col ">
                                        <div>
                                            {notification.product ? (
                                                <>
                                                    Product{" "}
                                                    <strong>
                                                        {" "}
                                                        {
                                                            notification
                                                                ?.product?.name
                                                        }
                                                    </strong>{" "}
                                                    was out of stock
                                                </>
                                            ) : (
                                                <p>{notification.content}</p>
                                            )}
                                        </div>
                                        <div
                                            className={cn(
                                                "",
                                                isEdit && "hidden"
                                            )}
                                        >
                                            {notification.product &&
                                                `Select to edit product`}
                                        </div>
                                    </div>
                                    <p className="text-xs">
                                        {moment(notification.createdAt).fromNow(
                                            true
                                        )}
                                    </p>
                                </div>
                            ))}
                        </div>
                        {/* <Listbox
                            items={notifications}
                            aria-label="notifications-menu"
                            onAction={
                                isEdit ? () => {} : handleSelectNotification
                            }
                            bottomContent={
                                <div className="w-full flex justify-between items-center">
                                    <Button size="sm" variant="light">
                                        <CopyCheckIcon className="w-4 h-4" />{" "}
                                        Mark all as read
                                    </Button>
                                    {isEdit && (
                                        <Button size="sm" color="danger">
                                            <TrashIcon className="w-4 h-4" />{" "}
                                            Delete
                                        </Button>
                                    )}
                                </div>
                            }
                        >
                            {(notification) => (
                                <ListboxItem
                                    key={notification.id}
                                    startContent={
                                        <div className="relative">
                                            {isEdit ? (
                                                <>
                                                    <Checkbox />
                                                </>
                                            ) : (
                                                <>
                                                    <BellIcon className="w-5 h-5" />
                                                    {!notification.isReaded && (
                                                        <>
                                                            <div className="absolute top-0 right-[5%] -mr-1 -mt-1 w-3 h-3 rounded-full bg-danger-400 animate-ping"></div>
                                                            <div className="absolute top-0 right-[5%] -mr-1 -mt-1 w-3 h-3 rounded-full bg-danger-400"></div>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    }
                                    classNames={{
                                        description: `${
                                            isEdit ? "hidden" : "abc"
                                        }`,
                                    }}
                                    description={
                                        notification.product &&
                                        `Select to edit product`
                                    }
                                    endContent={
                                        <p className="text-xs">
                                            {moment(
                                                notification.createdAt
                                            ).fromNow(true)}
                                        </p>
                                    }
                                    // href={
                                    //     notification.product
                                    //         ? `/dashboard/products/${notification.product.id}/edit`
                                    //         : undefined
                                    // }
                                >
                                    {notification.product ? (
                                        <>
                                            Product{" "}
                                            <strong>
                                                {" "}
                                                {notification?.product?.name}
                                            </strong>{" "}
                                            was out of stock
                                        </>
                                    ) : (
                                        <p>{notification.content}</p>
                                    )}
                                </ListboxItem>
                            )}
                        </Listbox> */}
                    </CardBody>
                    <CardFooter className="w-full flex justify-between items-center">
                        <Button size="sm" variant="light">
                            <CopyCheckIcon className="w-4 h-4" /> Mark all as
                            read
                        </Button>
                        {isEdit && (
                            <Button
                                size="sm"
                                color="danger"
                                isDisabled={selectDelete.length === 0}
                                onClick={handleDeleteNotifications}
                            >
                                <TrashIcon className="w-4 h-4" /> Delete
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </PopoverContent>
        </Popover>
    );
}
