"use server"

import { requireAdmin } from "@/app/data/admin/require-admin"
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet"
import { prisma } from "@/lib/db"
import { ApiResponse } from "@/lib/types"
import { chapterSchema, ChapterSchemaType, courseSchema, CourseSchemaType, lessonSchema, LessonSchemaType } from "@/lib/zodSchemas"
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

        await prisma.course.update({
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return {
            status: "error",
            message: "Failed to reorder chapters"
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

        await prisma.$transaction(async (tx) => {
            const maxPos = await tx.chapter.findFirst({
                where: {
                    courseId: result.data.courseId
                },
                select: {
                    position: true
                },
                orderBy: {
                    position: "desc"
                }
            })

            await tx.chapter.create({
                data: {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return {
            status: "error",
            message: "Failed to create chapter"
        }
    }
}

export async function createLesson(data: LessonSchemaType): Promise<ApiResponse> {
    // await requireAdmin()
    try {
        const result = lessonSchema.safeParse(data)
        if (!result.success) {
            return {
                status: "error",
                message: "Invalid form data"
            }
        }

        await prisma.$transaction(async (tx) => {
            const maxPos = await tx.lesson.findFirst({
                where: {
                    chapterId: result.data.chapterId
                },
                select: {
                    position: true
                },
                orderBy: {
                    position: "desc"
                }
            })

            await tx.lesson.create({
                data: {
                    title: result.data.title,
                    description: result.data.description,
                    videoKey: result.data.videoKey,
                    thumbnailKey: result.data.thumbnailKey,
                    position: maxPos?.position ? maxPos.position + 1 : 1,
                    chapterId: result.data.chapterId
                }
            })
        })
        revalidatePath(`/admin/courses/${result.data.courseId}/edit`)
        return {
            status: "success",
            message: "Lesson created successfully"
        }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return {
            status: "error",
            message: "Failed to create lesson"
        }
    }
}

// deletete lesson interface
interface DeleteLessonProps {
    lessonId: string,
    courseId: string,
    chapterId: string
}
// delete lesson action
export async function deleteLesson({ lessonId, courseId, chapterId }: DeleteLessonProps): Promise<ApiResponse> {
    await requireAdmin()
    try {
        const chapterWithLesson = await prisma.chapter.findUnique({
            where: {
                id: chapterId
            },
            select: {
                lessons: {
                    orderBy: {
                        position: "asc"
                    },
                    select: {
                        id: true,
                        position: true
                    }
                },
            }
        })

        if (!chapterWithLesson) {
            return {
                status: "error",
                message: "Chapter not found"
            }
        }

        const lessons = chapterWithLesson.lessons;

        const lessonToDelete = lessons.find((lesson) => lesson.id === lessonId)

        if (!lessonToDelete) {
            return {
                status: "error",
                message: "Lesson not found in chapter"
            }
        }

        const remainingLessons = lessons.filter((lesson) => lesson.id !== lessonId)

        const updates = remainingLessons.map((lesson, index) =>{
            return prisma.lesson.update({
                where: {
                    id: lesson.id
                },
                data: {
                    position: index + 1
                }
            })
        })

        await prisma.$transaction([
            ...updates,
            prisma.lesson.delete({
                where: {
                    id: lessonId,
                    chapterId: chapterId
                }
            })
        ])

        revalidatePath(`/admin/courses/${courseId}/edit`)

        return {
            status: "success",
            message: "Lesson deleted successfully"
        }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return {
            status: "error",
            message: "Failed to delete lesson"
        }
    }
}

interface DeleteChapterProps {
    chapterId: string,
    courseId: string
}
// delete chapter action
export async function deleteChapter({ chapterId, courseId }: DeleteChapterProps): Promise<ApiResponse> {
    await requireAdmin()
    try {
        const courseWithChapters = await prisma.course.findUnique({
            where: {
                id: courseId
            },
            select: {
                chapters: {
                    orderBy: {
                        position: "asc"
                    },
                    select: {
                        id: true,
                        position: true
                    }
                },
            }
        })

        if (!courseWithChapters) {
            return {
                status: "error",
                message: "Course not found"
            }
        }

        const chapters = courseWithChapters.chapters;

        const chapterToDelete = chapters.find((chapter) => chapter.id === chapterId)

        if (!chapterToDelete) {
            return {
                status: "error",
                message: "Chapter not found in course"
            }
        }

        const remainingChapters = chapters.filter((chapter) => chapter.id !== chapterId)

        const updates = remainingChapters.map((chapter, index) =>{
            return prisma.chapter.update({
                where: {
                    id: chapter.id
                },
                data: {
                    position: index + 1
                }
            })
        })

        await prisma.$transaction([
            ...updates,
            prisma.chapter.delete({
                where: {    
                    id: chapterId,
                }
            })
        ])

        revalidatePath(`/admin/courses/${courseId}/edit`)

        return {
            status: "success",
            message: "Chapter deleted successfully"
        }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return {
            status: "error",
            message: "Failed to delete chapter"
        }
    }
}


