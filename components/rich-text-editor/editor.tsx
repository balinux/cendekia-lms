"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./menu-bar";
import TextAlign from "@tiptap/extension-text-align";
export function RichTextEditor({field}: {field: any}) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ["paragraph", "heading"],
            }),
        ],
        editorProps: {
            attributes: {
                class: "min-h-[300px] p-4 focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none",
            },
        },

        immediatelyRender: false,
        
        onUpdate({ editor }) {
            // field.onChange(editor.getHTML());
            field.onChange(JSON.stringify(editor.getJSON()));
        },

        content: field.value ? JSON.parse(field.value) : "Hello world",
    })
    return (
        <div className="w-full border border-input rounded-lg overflow-hidden dark:bg-input/30 ">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}