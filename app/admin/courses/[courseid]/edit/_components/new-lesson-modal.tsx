import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormLabel, FormMessage, FormDescription, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { tryCatch } from "@/hooks/try-catch"
import { chapterSchema, ChapterSchemaType, lessonSchema, LessonSchemaType } from "@/lib/zodSchemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, PlusIcon } from "lucide-react"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { createLesson } from "../action"
import { toast } from "sonner"

interface iAppProps {
    courseId: string
    chapterId: string
}
export function NewLessonModal({ courseId, chapterId }: iAppProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    function handleOpenChange(open: boolean) {
        setIsOpen(open)
    }

    // 1. Define your form.
    const form = useForm<LessonSchemaType>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            title: "",
            courseId: courseId,
            chapterId: chapterId,
        },
    })

    async function onSubmit(values: LessonSchemaType) {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(createLesson(values))
            if (error) {
                toast.error("an error occurred, please try again")
                return;
            }
            if (result?.status === "success") {
                toast.success(result.message)
                form.reset()
                setIsOpen(false)
            } else if (result?.status === "error") {
                toast.error(result.message)
            }
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant='outline' className="w-full justify-center gap-2">
                    <PlusIcon className="mr-2 h-4 w-4" />
                    New Lesson
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>New Lesson</DialogTitle>
                    <DialogDescription>
                        Add a new lesson to your chapter
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lesson Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Lesson 1: Introduction" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is the title of the lesson
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Add Lesson
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

    )
}