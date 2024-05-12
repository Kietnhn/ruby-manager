"use client";
import { PlusIcon } from "@heroicons/react/24/outline";
import {
    Card,
    CardBody,
    CardHeader,
    Divider,
    Image,
    Link,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";

const NewCard = () => {
    const router = useRouter();
    return (
        <Card
            className="w-full h-full"
            isPressable
            onPress={() => router.push("/dashboard/brands/create")}
        >
            <CardHeader className="flex items-center gap-4 ">
                <Card className="w-10 aspect-square rounded-full">
                    <Image
                        className="w-full h-full object-contain"
                        shadow="sm"
                        radius="full"
                        classNames={{
                            wrapper: "h-full",
                        }}
                    />
                </Card>
                <div className="flex justify-start flex-col flex-1">
                    <Link
                        href={"/dashboard/brands/create"}
                        className="text-start"
                    >
                        <b className="text-start">Add new brand</b>
                    </Link>
                    <p className="text-gray-500 text-start">
                        With a special slogan
                    </p>
                </div>
            </CardHeader>
            <Divider />
            <CardBody>
                <Card className="w-full aspect-video flex items-center justify-center mb-4">
                    <PlusIcon className="w-8 h-8" />
                </Card>
                <div className="h-24 line-clamp-4">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Corporis enim ex eveniet maxime quidem beatae porro, aliquid
                    magni est sit aperiam veritatis quaerat neque, molestiae
                    vitae nostrum voluptates quasi ut?
                </div>
            </CardBody>
        </Card>
    );
};

export default NewCard;
