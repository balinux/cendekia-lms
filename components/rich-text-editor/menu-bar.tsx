import { type Editor } from "@tiptap/react"
import { Tooltip, TooltipContent, TooltipProvider } from "../ui/tooltip"
import { TooltipTrigger } from "@radix-ui/react-tooltip"
import { Toggle } from "../ui/toggle"
import { AlignCenter, AlignLeft, AlignRight, Bold, Heading1Icon, Heading2Icon, Heading3Icon, Italic, ListIcon, ListOrderedIcon, Redo, Strikethrough, Undo } from "lucide-react"
import { cn } from "@/lib/utils"

interface iAppProps {
    editor: Editor | null
}

export default function MenuBar({ editor }: iAppProps) {
    if (!editor) {
        return null
    }

    return (
        <div className="border border-input border-t-0 border-x-0 rounded-t-lg p-2 bg-card flex flex-wrap gap-1 items-center">
            <TooltipProvider>
                <div className="flex flex-wrap gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive("bold")}
                                onClick={() => editor.chain().focus().toggleBold().run()}
                                className={cn(
                                    editor.isActive("bold") && "bg-muted text-muted-foreground"
                                )}
                            >
                                <Bold />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Bold
                        </TooltipContent>
                    </Tooltip>

                    {/* italic */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive("italic")}
                                onClick={() => editor.chain().focus().toggleItalic().run()}
                                className={cn(
                                    editor.isActive("italic") && "bg-muted text-muted-foreground"
                                )}
                            >
                                <Italic />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Italic
                        </TooltipContent>
                    </Tooltip>

                    {/* strike */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive("strike")}
                                onClick={() => editor.chain().focus().toggleStrike().run()}
                                className={cn(
                                    editor.isActive("strike") && "bg-muted text-muted-foreground"
                                )}
                            >
                                <Strikethrough />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Strike
                        </TooltipContent>
                    </Tooltip>

                    {/* heading 1 */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive("heading", { level: 1 })}
                                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                                className={cn(
                                    editor.isActive("heading", { level: 1 }) && "bg-muted text-muted-foreground"
                                )}
                            >
                                <Heading1Icon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Heading 1
                        </TooltipContent>
                    </Tooltip>

                    {/* heading 2 */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive("heading", { level: 2 })}
                                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                className={cn(
                                    editor.isActive("heading", { level: 2 }) && "bg-muted text-muted-foreground"
                                )}
                            >
                                <Heading2Icon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Heading 2
                        </TooltipContent>
                    </Tooltip>

                    {/* heading 3 */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive("heading", { level: 3 })}
                                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                                className={cn(
                                    editor.isActive("heading", { level: 3 }) && "bg-muted text-muted-foreground"
                                )}
                            >
                                <Heading3Icon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Heading 3
                        </TooltipContent>
                    </Tooltip>

                    {/* bullet list */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive("bulletList")}
                                onClick={() => editor.chain().focus().toggleBulletList().run()}
                                className={cn(
                                    editor.isActive("bulletList") && "bg-muted text-muted-foreground"
                                )}
                            >
                                <ListIcon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Bullet List
                        </TooltipContent>
                    </Tooltip>

                    {/* ordered list */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive("orderedList")}
                                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                className={cn(
                                    editor.isActive("orderedList") && "bg-muted text-muted-foreground"
                                )}
                            >
                                <ListOrderedIcon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Ordered List
                        </TooltipContent>
                    </Tooltip>

                    <div className="w-px h-6 bg-border mx-2"></div>
                    <div className="flex flex-wrap gap-1">
                        {/* text align */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Toggle
                                    size="sm"
                                    pressed={editor.isActive({textAlign: "left"})}
                                    onClick={() => editor.chain().focus().setTextAlign("left").run()}
                                    className={cn(
                                        editor.isActive({textAlign: "left"}) && "bg-muted text-muted-foreground"
                                    )}
                                >
                                    <AlignLeft />
                                </Toggle>
                            </TooltipTrigger>
                            <TooltipContent>
                                Align Left
                            </TooltipContent>
                        </Tooltip>

                        {/* align center */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Toggle
                                    size="sm"
                                    pressed={editor.isActive({textAlign: "center"})}
                                    onClick={() => editor.chain().focus().setTextAlign("center").run()}
                                    className={cn(
                                        editor.isActive({textAlign: "center"}) && "bg-muted text-muted-foreground"
                                    )}
                                >
                                    <AlignCenter />
                                </Toggle>
                            </TooltipTrigger>
                            <TooltipContent>
                                Align Center
                            </TooltipContent>
                        </Tooltip>

                        {/* align right */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Toggle
                                    size="sm"
                                    pressed={editor.isActive({textAlign: "right"})}
                                    onClick={() => editor.chain().focus().setTextAlign("right").run()}
                                    className={cn(
                                        editor.isActive({textAlign: "right"}) && "bg-muted text-muted-foreground"
                                    )}
                                >
                                    <AlignRight />
                                </Toggle>
                            </TooltipTrigger>
                            <TooltipContent>
                                Align Right
                            </TooltipContent>
                        </Tooltip>
                        
                    </div>

                    <div className="w-px h-6 bg-border mx-2"></div>
                    <div className="flex flex-wrap gap-1">
                        {/* undo */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Toggle
                                    size="sm"
                                    // pressed={editor.can().undo()}
                                    disabled={!editor.can().undo()}
                                    onClick={() => editor.chain().focus().undo().run()}
                                    className={cn(
                                        editor.can().undo() && "bg-muted text-muted-foreground"
                                    )}
                                >
                                    <Undo />
                                </Toggle>
                            </TooltipTrigger>
                            <TooltipContent>
                                Undo
                            </TooltipContent>
                        </Tooltip>

                        {/* redo */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Toggle
                                    size="sm"
                                    // pressed={editor.can().redo()}
                                    disabled={!editor.can().redo()}
                                    onClick={() => editor.chain().focus().redo().run()}
                                    className={cn(
                                        editor.can().redo() && "bg-muted text-muted-foreground"
                                    )}
                                >
                                    <Redo />
                                </Toggle>
                            </TooltipTrigger>
                            <TooltipContent>
                                Redo
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </TooltipProvider>
        </div>
    )
}