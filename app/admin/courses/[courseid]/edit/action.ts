"use server"

import { requireAdmin } from "@/data/admin/require-admin"
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet"
import { prisma } from "@/lib/db"
import { ApiResponse } from "@/lib/types"
import { chapterSchema, ChapterSchemaType, courseSchema, CourseSchemaType } from "@/lib/zodSchemas"
import { request } from "@arcjet/next"
import { revalidatePath } from "next/cache"

const aj = arcjet.withRule(
    detectBot({
        mode: "LIVE",
        allow: []
    })
)
    .withRule(
        fixedWindow({
            mode: "LIVE",
            window: "1m",
            max: 5
        })
    )

export async function editCourse(data: CourseSchemaType, courseId: string): Promise<ApiResponse> {
    const session = await requireAdmin()

    try {
        // Access request data that Arcjet needs when you call `protect()` similarly
        // to `await headers()` and `await cookies()` in `next/headers`
        const req = await request();

        // call arcjet protect
        const decision = await aj.protect(req, {
            fingerprint: session?.user.id as string
        })

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return {
                    status: "error",
                    message: "Too many requests",
                }
            } else if (decision.reason.isBot()) {
                return {
                    status: "error",
                    message: "you are a bot, if you think this is a mistake, please contact support",
                }
            } else {
                return {
                    status: "error",
                    message: "you are a bot, if you think this is a mistake, please contact support",
                }
            }
        }

        const result = courseSchema.safeParse(data)
        if (!result.success) {
            return {
                status: "error",
                message: "invalid form data"
            }
        }

        const course = await prisma.course.update({
            where: {
                id: courseId,
                userId: session.user.id
            },
            data: {
                ...result.data
            }
        })

        return {
            status: "success",
            message: "Course updated successfully"
        }
    } catch (error) {
        return {
            status: "error",
            message: "Failed to update course"
        }
    }


}

interface ReOrderLessonProps {
    chapterId: string,
    lessons: { id: string, position: number }[],
    courseId: string
}

export async function reOrderLesson({ chapterId, lessons, courseId }: ReOrderLessonProps): Promise<ApiResponse> {
    await requireAdmin()
    try {
        if (!lessons || lessons.length === 0) {
            return {
                status: "error",
                message: "lessons is required"
            }
        }

        const updates = lessons.map((lesson) =>
            prisma.lesson.update({
                where: {
                    id: lesson.id,
                    chapterId: chapterId
                },
                data: {
                    position: lesson.position
                }
            })
        );

        await prisma.$transaction(updates);

        revalidatePath(`/admin/courses/${courseId}/edit`)

        return {
            status: "success",
            message: "Lessons reordered successfully"
        }
    } catch (error) {
        return {
            status: "error",
            message: "Failed to reorder lessons"
        }
    }
}

interface ReOrderChapterProps {
    courseId: string,
    chapters: { id: string, position: number }[]
}

export async function reOrderChapter({ chapters, courseId }: ReOrderChapterProps): Promise<ApiResponse> {
    await requireAdmin()
    try {
        if (!chapters || chapters.length === 0) {
            return {
                status: "error",
                message: "chapters is required"
            }
        }

        const updates = chapters.map((chapter) =>
            prisma.chapter.update({
                where: {
                    id: chapter.id,
                    courseId: courseId
                },
                data: {
                    position: chapter.position
                }
            })
        );

        await prisma.$transaction(updates);

        revalidatePath(`/admin/courses/${courseId}/edit`)

        return {
            status: "success",
            message: "Chapters reordered successfully"
        }
        
    } catch (error) {
        return{
            status:"error",
            message:"Failed to reorder chapters"
        }
    }
}

export async function createChapter(data: ChapterSchemaType): Promise<ApiResponse> {
    await requireAdmin()
    try {
        const result = chapterSchema.safeParse(data)
        if (!result.success) {
            return {
                status: "error",
                message: "Invalid form data"
            }
        }

        await prisma.$transaction(async(tx) => {
            const maxPos = await tx.chapter.findFirst({
                where:{
                    courseId: result.data.courseId
                },
                select:{
                    position:true
                },
                orderBy:{
                    position:"desc"
                }
            })

            await tx.chapter.create({
                data:{
                    title: result.data.title,
                    position: maxPos?.position ? maxPos.position + 1 : 1,
                    courseId: result.data.courseId
                }
            })
        })   
        revalidatePath(`/admin/courses/${result.data.courseId}/edit`)
        return {
            status: "success",
            message: "Chapter created successfully"
        }        
    } catch (error) {
        return {
            status: "error",
            message: "Failed to create chapter"
        }
    }
}


