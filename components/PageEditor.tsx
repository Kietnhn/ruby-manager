import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar";
import { Card, CardHeader, Divider } from "@nextui-org/react";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import AdvancedToolbar from "./AdvancedToolbar";

Image.configure({
    HTMLAttributes: {
        class: "image",
    },
});
const PageEditor = ({
    onChange,
    className,
    content,
    height,
}: {
    onChange: (value: string) => void;
    content: string;
    className?: string;
    height?: string;
}) => {
    const handleChange = (newContent: string) => {
        onChange(newContent);
    };
    const editor = useEditor({
        extensions: [StarterKit, Underline, Image, Link],
        editorProps: {
            attributes: {
                class: `flex flex-col px-4 py-3 justify-start text-foreground ${
                    height ? height : " min-h-36"
                } items-start w-full  pt-4 outline-none`,
            },
        },
        onUpdate: ({ editor }) => {
            handleChange(editor.getHTML());
        },
        content: content || "",
    });
    if (!editor) return <></>;

    return (
        <Card className={className}>
            <CardHeader className="flex justify-between items-start">
                <div className="flex border-r-2 p-1">
                    <Toolbar editor={editor} isFull={true} />
                </div>
                <AdvancedToolbar editor={editor} />
            </CardHeader>
            <Divider />
            <EditorContent editor={editor} />
        </Card>
    );
};

export default PageEditor;
