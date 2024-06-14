"use client";

import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Link,
} from "@nextui-org/react";

export default function CreateSectionForm() {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-bold text-center">
                Select one template
            </h2>
            <div className="grid grid-cols-2 gap-4">
                <Card
                    isPressable
                    as={Link}
                    href={"/dashboard/sections/create/landscape"}
                >
                    <CardHeader className="flex-center flex-col ">
                        <p>SubTitle</p>
                        <h2 className="text-2xl font-semibold">Title</h2>
                        <p className="text-foreground-500">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit.
                        </p>
                    </CardHeader>
                    <CardBody>
                        <div className="w-full aspect-video bg-default-500 rounded-sm"></div>
                    </CardBody>
                    <CardFooter className="flex-center">Landscape</CardFooter>
                </Card>
                <Card
                    isPressable
                    as={Link}
                    href={"/dashboard/sections/create/carousel"}
                >
                    <CardBody className="justify-end">
                        <div className="mb-4">
                            <h2 className="text-2xl font-semibold">Title</h2>
                            <p>Description</p>
                        </div>
                        <div className="w-full grid grid-cols-3 gap-4">
                            <div className="w-full flex flex-col gap-2">
                                <div className="aspect-square bg-default-500 rounded-sm"></div>
                                <p>Name</p>
                            </div>
                            <div className="w-full flex flex-col gap-2">
                                <div className="aspect-square bg-default-500 rounded-sm"></div>
                                <p>Name</p>
                            </div>
                            <div className="w-full flex flex-col gap-2">
                                <div className="aspect-square bg-default-500 rounded-sm"></div>
                                <p>Name</p>
                            </div>
                        </div>
                    </CardBody>
                    <CardFooter className="flex-center">Carousel</CardFooter>
                </Card>
            </div>
        </div>
    );
}
