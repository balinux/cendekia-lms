"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { tryCatch } from "@/hooks/try-catch"
import { toast } from "sonner"
import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { courseCategories, courseLevels, courseSchema, CourseSchemaType, courseStatus } from "@/lib/zodSchemas"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2Icon, PlusIcon, SparkleIcon } from "lucide-react";
import slugify from "slugify";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichTextEditor } from "@/components/rich-text-editor/editor";
import FileUploader from "@/components/file-uploader/uploader";
import Uploader from "@/components/file-uploader/uploader";
import { AdminCourseSingularType } from "@/data/admin/admin-get-course";
import { editCourse } from "../action"

interface iAppProps {
    data: AdminCourseSingularType
}


export default function EditCourseForm({data}: iAppProps) {
    // add transition
        const [isPending, startTransition] = useTransition();
        const router = useRouter()
        
     // 1. Define your form.
        const form = useForm<CourseSchemaType>({
            resolver: zodResolver(courseSchema),
            defaultValues: {
                title: data.title,
                description: data.description,
                fileKey: data.fileKey,
                price: data.price,
                duration: data.duration,
                level: data.level,
                status: data.status,
                category: data.category as CourseSchemaType["category"],
                smallDescription: data.smallDescription,
                slug: data.slug,
            },
        })

        // 2. Define a submit handler.
            function onSubmit(values: CourseSchemaType) {
                // Do something with the form values.
                // ✅ This will be type-safe and validated.
                // console.log(values)
                startTransition(async () => {
                    const { data: results, error } = await tryCatch(editCourse(values, data.id))
                    if (error) {
                        toast.error(error.message)
                    }
        
                    if (results?.status === "success") {
                        toast.success(results.message)
                        form.reset()
                        router.push("/admin/courses")
                    } else if (results?.status === "error") {
                        toast.error(results.message)
                    }
        
                })
        
            }
        
        
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Enter course title" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>


                    )}
                />

                {/* slug */}
                <div className="flex gap-4 items-end">
                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Enter course slug" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button className="flex items-center gap-2 w-fit" type="button" onClick={() => {
                        const slug = slugify(form.getValues("title"))
                        form.setValue("slug", slug, { shouldValidate: true })
                    }}>
                        Generate slug <SparkleIcon className="ml-1" size={16} />
                    </Button>
                </div>

                {/* small description */}
                <FormField
                    control={form.control}
                    name="smallDescription"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Small Description</FormLabel>
                            <FormControl>
                                <Textarea className="min-h-[120px]" {...field} placeholder="Enter course small description" />
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
                                {/* <Textarea className="min-h-[120px]" {...field} placeholder="Enter course description" /> */}
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* thumbnail */}
                <FormField
                    control={form.control}
                    name="fileKey"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Thumbnail</FormLabel>
                            <FormControl>
                                <Uploader value={field.value} onChange={field.onChange} />
                                {/* <Input {...field} placeholder="Enter course thumbnail" /> */}
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {courseCategories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* level */}
                    <FormField
                        control={form.control}
                        name="level"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel >Level</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a level" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {courseLevels.map((level) => (
                                            <SelectItem key={level} value={level}>
                                                {level}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* duration */}
                    <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel >Duration</FormLabel>
                                <Input type="number" {...field} onChange={event => field.onChange(+event.target.value)} />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* price */}
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel >Price (in IDR) </FormLabel>
                                <Input type="number" {...field} onChange={event => field.onChange(+event.target.value)} />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* status */}
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel >Status</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {courseStatus.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* submit button */}
                <Button
                    type="submit"
                    disabled={isPending}>
                    {isPending
                        ? <>
                            Editing Course...
                            <Loader2Icon className="ml-1 h-4 w-4 animate-spin" />
                        </>
                        : <>
                            Edit Course
                            <PlusIcon className="ml-1" size={16} />
                        </>}
                </Button>
            </form>
        </Form>
    )
}