import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar";
import { Card, CardHeader, Divider } from "@nextui-org/react";
import Underline from "@tiptap/extension-underline";

const Tiptap = ({
    onChange,
    className,
    content,
    minHeight,
}: {
    onChange: (value: string) => void;
    content: string;
    className?: string;
    minHeight?: string;
}) => {
    const handleChange = (newContent: string) => {
        onChange(newContent);
    };
    const editor = useEditor({
        extensions: [StarterKit, Underline],
        editorProps: {
            attributes: {
                class: `flex flex-col px-4 py-3 justify-start text-foreground ${
                    minHeight ? minHeight : " min-h-36"
                } items-start w-full  pt-4 outline-none`,
            },
        },
        onUpdate: ({ editor }) => {
            handleChange(editor.getHTML());
        },
        content: content || "",
    });
    return (
        <Card className={className}>
            <CardHeader>
                <Toolbar editor={editor} />
            </CardHeader>
            <Divider />
            <EditorContent editor={editor} />
        </Card>
    );
};

export default Tiptap;
