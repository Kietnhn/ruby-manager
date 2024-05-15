"use client";
// components/CategoryTree.js

import { ICategory } from "@/lib/definitions";
import { Button, Link } from "@nextui-org/react";

import Collapse from "./collapse";
import { PencilIcon } from "@heroicons/react/24/outline";

const CategoryTree = ({ categories }: { categories: ICategory[] }) => {
    // Function to get the children of a parent category
    const getChildren = (parentId: string | null) => {
        return categories.filter((category) => category.parentId === parentId);
    };

    // Recursive function to render the tree
    const renderTree = (parentId: string | null) => {
        const children = getChildren(parentId);
        if (!children.length) return null;

        return (
            <ul className="flex flex-col gap-2">
                {children.map((child) => (
                    <li key={child.id} className="ml-6">
                        {getChildren(child.id).length > 0 ? (
                            <Collapse
                                title={
                                    <div className="flex gap-4 items-center">
                                        <p className="font-semibold">
                                            {child.name}
                                            <span className="text-foreground-500 font-normal">
                                                -{child.code}
                                            </span>
                                        </p>
                                        <Button
                                            size="sm"
                                            isIconOnly
                                            as={Link}
                                            href={`/dashboard/categories/${child.id}/edit`}
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                }
                            >
                                {renderTree(child.id)}
                            </Collapse>
                        ) : (
                            <Button
                                className="w-full justify-start"
                                variant="bordered"
                                radius="sm"
                                as={Link}
                                href={`/dashboard/categories/${child.id}/edit`}
                            >
                                <p className="font-semibold">
                                    {child.name}
                                    <span className="text-foreground-500 font-normal">
                                        -{child.code}
                                    </span>
                                </p>
                                <PencilIcon className="w-4 h-4" />
                            </Button>
                        )}
                    </li>
                ))}
            </ul>
        );
    };

    return <div>{renderTree(null)}</div>;
};

export default CategoryTree;
