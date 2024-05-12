"use client";

import React from "react";
import { type Editor } from "@tiptap/react";
import {
    Bold,
    Strikethrough,
    Italic,
    List,
    ListOrdered,
    Heading2,
    Underline,
    Quote,
    Undo,
    Redo,
    Code,
    Heading1,
    Heading3,
    Heading4,
    Heading5,
    Heading6,
    WrapText,
} from "lucide-react";
import { Button, Tooltip } from "@nextui-org/react";

type Props = {
    editor: Editor | null;
    isFull?: boolean;
};

const Toolbar = ({ editor, isFull }: Props) => {
    if (!editor) {
        return null;
    }

    return (
        <div className="flex justify-start items-center gap-1 w-full flex-wrap ">
            <Tooltip showArrow content="Bold">
                <Button
                    size="sm"
                    variant="light"
                    isIconOnly
                    onClick={(e) => {
                        e.preventDefault();
                        editor.chain().focus().toggleBold().run();
                    }}
                    className={
                        editor.isActive("bold")
                            ? "bg-black text-white"
                            : "text-foreground"
                    }
                >
                    <Bold className="w-5 h-5" />
                </Button>
            </Tooltip>

            <Tooltip showArrow content="Italic">
                <Button
                    size="sm"
                    variant="light"
                    isIconOnly
                    onClick={(e) => {
                        e.preventDefault();
                        editor.chain().focus().toggleItalic().run();
                    }}
                    className={
                        editor.isActive("italic")
                            ? "bg-black text-white"
                            : "text-foreground"
                    }
                >
                    <Italic className="w-5 h-5" />
                </Button>
            </Tooltip>
            <Tooltip showArrow content="Underline">
                <Button
                    size="sm"
                    variant="light"
                    isIconOnly
                    onClick={(e) => {
                        e.preventDefault();
                        editor.chain().focus().toggleUnderline().run();
                    }}
                    className={
                        editor.isActive("underline")
                            ? "bg-black text-white"
                            : "text-foreground"
                    }
                >
                    <Underline className="w-5 h-5" />
                </Button>
            </Tooltip>
            <Tooltip showArrow content="Strike">
                <Button
                    size="sm"
                    variant="light"
                    isIconOnly
                    onClick={(e) => {
                        e.preventDefault();
                        editor.chain().focus().toggleStrike().run();
                    }}
                    className={
                        editor.isActive("strike")
                            ? "bg-black text-white"
                            : "text-foreground"
                    }
                >
                    <Strikethrough className="w-5 h-5" />
                </Button>
            </Tooltip>
            {isFull && (
                <>
                    <Tooltip showArrow content="Quote">
                        <Button
                            size="sm"
                            variant="light"
                            isIconOnly
                            onClick={(e) => {
                                e.preventDefault();
                                editor.chain().focus().toggleBlockquote().run();
                            }}
                            className={
                                editor.isActive("blockquote")
                                    ? "bg-black text-white"
                                    : "text-foreground"
                            }
                        >
                            <Quote className="w-5 h-5" />
                        </Button>
                    </Tooltip>
                    <Tooltip showArrow content="Code block">
                        <Button
                            size="sm"
                            variant="light"
                            isIconOnly
                            onClick={(e) => {
                                e.preventDefault();
                                editor.chain().focus().toggleCodeBlock().run();
                            }}
                            className={
                                editor.isActive("codeBlock")
                                    ? "bg-black text-white"
                                    : "text-foreground"
                            }
                        >
                            <Code className="w-5 h-5" />
                        </Button>
                    </Tooltip>
                </>
            )}
            {isFull && (
                <Tooltip showArrow content="Heading 1">
                    <Button
                        size="sm"
                        variant="light"
                        isIconOnly
                        onClick={(e) => {
                            e.preventDefault();
                            editor
                                .chain()
                                .focus()
                                .toggleHeading({ level: 1 })
                                .run();
                        }}
                        className={
                            editor.isActive("heading", { level: 1 })
                                ? "bg-black text-white"
                                : "text-foreground"
                        }
                    >
                        <Heading1 className="w-5 h-5" />
                    </Button>
                </Tooltip>
            )}
            <Tooltip showArrow content="Heading 2">
                <Button
                    size="sm"
                    variant="light"
                    isIconOnly
                    onClick={(e) => {
                        e.preventDefault();
                        editor
                            .chain()
                            .focus()
                            .toggleHeading({ level: 2 })
                            .run();
                    }}
                    className={
                        editor.isActive("heading", { level: 2 })
                            ? "bg-black text-white"
                            : "text-foreground"
                    }
                >
                    <Heading2 className="w-5 h-5" />
                </Button>
            </Tooltip>
            {isFull && (
                <>
                    <Tooltip showArrow content="Heading 3">
                        <Button
                            size="sm"
                            variant="light"
                            isIconOnly
                            onClick={(e) => {
                                e.preventDefault();
                                editor
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level: 3 })
                                    .run();
                            }}
                            className={
                                editor.isActive("heading", { level: 3 })
                                    ? "bg-black text-white"
                                    : "text-foreground"
                            }
                        >
                            <Heading3 className="w-5 h-5" />
                        </Button>
                    </Tooltip>
                    <Tooltip showArrow content="Heading 4">
                        <Button
                            size="sm"
                            variant="light"
                            isIconOnly
                            onClick={(e) => {
                                e.preventDefault();
                                editor
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level: 4 })
                                    .run();
                            }}
                            className={
                                editor.isActive("heading", { level: 4 })
                                    ? "bg-black text-white"
                                    : "text-foreground"
                            }
                        >
                            <Heading4 className="w-5 h-5" />
                        </Button>
                    </Tooltip>
                    <Tooltip showArrow content="Heading 5">
                        <Button
                            size="sm"
                            variant="light"
                            isIconOnly
                            onClick={(e) => {
                                e.preventDefault();
                                editor
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level: 5 })
                                    .run();
                            }}
                            className={
                                editor.isActive("heading", { level: 5 })
                                    ? "bg-black text-white"
                                    : "text-foreground"
                            }
                        >
                            <Heading5 className="w-5 h-5" />
                        </Button>
                    </Tooltip>
                    <Tooltip showArrow content="Heading 6">
                        <Button
                            size="sm"
                            variant="light"
                            isIconOnly
                            onClick={(e) => {
                                e.preventDefault();
                                editor
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level: 6 })
                                    .run();
                            }}
                            className={
                                editor.isActive("heading", { level: 6 })
                                    ? "bg-black text-white"
                                    : "text-foreground"
                            }
                        >
                            <Heading6 className="w-5 h-5" />
                        </Button>
                    </Tooltip>
                    <Tooltip showArrow content="Break line">
                        <Button
                            size="sm"
                            variant="light"
                            isIconOnly
                            onClick={(e) => {
                                e.preventDefault();
                                editor.chain().focus().setHardBreak().run();
                            }}
                        >
                            <WrapText className="w-5 h-5" />
                        </Button>
                    </Tooltip>
                </>
            )}
            <Tooltip showArrow content="Bullet list">
                <Button
                    size="sm"
                    variant="light"
                    isIconOnly
                    onClick={(e) => {
                        e.preventDefault();
                        editor.chain().focus().toggleBulletList().run();
                    }}
                    className={
                        editor.isActive("bulletList")
                            ? "bg-black text-white"
                            : "text-foreground"
                    }
                >
                    <List className="w-5 h-5" />
                </Button>
            </Tooltip>
            <Tooltip showArrow content="Ordered list">
                <Button
                    size="sm"
                    variant="light"
                    isIconOnly
                    onClick={(e) => {
                        e.preventDefault();
                        editor.chain().focus().toggleOrderedList().run();
                    }}
                    className={
                        editor.isActive("orderedList")
                            ? "bg-black text-white"
                            : "text-foreground"
                    }
                >
                    <ListOrdered className="w-5 h-5" />
                </Button>
            </Tooltip>

            <Tooltip showArrow content="Undo">
                <Button
                    size="sm"
                    variant="light"
                    isIconOnly
                    onClick={(e) => {
                        e.preventDefault();
                        editor.chain().focus().undo().run();
                    }}
                    className={
                        editor.isActive("undo")
                            ? "bg-black text-white"
                            : "text-foreground hover:bg-sky-700 hover:text-white p-1 hover:rounded-lg"
                    }
                >
                    <Undo className="w-5 h-5" />
                </Button>
            </Tooltip>
            <Tooltip showArrow content="Redo">
                <Button
                    size="sm"
                    variant="light"
                    isIconOnly
                    onClick={(e) => {
                        e.preventDefault();
                        editor.chain().focus().redo().run();
                    }}
                    className={
                        editor.isActive("redo")
                            ? "bg-black text-white"
                            : "text-foreground hover:bg-sky-700 hover:text-white p-1 hover:rounded-lg"
                    }
                >
                    <Redo className="w-5 h-5" />
                </Button>
            </Tooltip>
        </div>
    );
};

export default Toolbar;
