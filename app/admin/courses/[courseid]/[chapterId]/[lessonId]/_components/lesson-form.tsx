"use client"

import Uploader from "@/components/file-uploader/uploader"
import { RichTextEditor } from "@/components/rich-text-editor/editor"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AdminLessonType } from "@/data/admin/admin-get-lesson"
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchemas"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useForm } from "react-hook-form"

interface IProps {
    lesson: AdminLessonType
    chapterId: string
    courseId: string
}
export default function LessonForm({ lesson, chapterId, courseId }: IProps) {

    // 1. Define your form.
    const form = useForm<LessonSchemaType>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            title: lesson.title,
            chapterId: chapterId,
            courseId: courseId,
            description: lesson.description ?? undefined,
            thumbnailKey: lesson.thumbnailKey ?? undefined,
            videoKey: lesson.videoKey ?? undefined,
        },
    })

    function onSubmit(values: LessonSchemaType) {
        console.log(values)
    }

    return (
        <div>
            <Link
                className={buttonVariants({ variant: "outline", className: "mb-6" })}
                href={`/admin/courses/${courseId}/edit`}>
                Back to Course
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle>Edit Lesson</CardTitle>
                    <CardDescription>Configure lesson details</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter lesson title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* description */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <RichTextEditor field={field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* thumbnail */}
                            <FormField
                                control={form.control}
                                name="thumbnailKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Thumbnail</FormLabel>
                                        <FormControl>
                                            <Uploader onChange={field.onChange} value={field.value} fileTypeAllowed="image" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* video */}
                            <FormField
                                control={form.control}
                                name="videoKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Video</FormLabel>
                                        <FormControl>
                                            <Uploader onChange={field.onChange} value={field.value} fileTypeAllowed="video" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* buttton */}
                            <Button type="submit">Submit</Button>
                            {/* <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full"
                            >
                                {isPending ? (
                                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <PlusIcon className="mr-2 h-4 w-4" />
                                )}
                                {isPending ? "Creating..." : "Create Course"}
                            </Button> */}
                        </form>
                    </Form>

                </CardContent>
            </Card>
        </div>
    )
}