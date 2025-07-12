'server-only'

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin"
import { notFound } from "next/navigation";

export default async function AdminGetCourse(courseId: string) {
    await requireAdmin();

    const course = await prisma.course.findUnique({
        where: {
            id: courseId
        },
        select: {
            id: true,
            title: true,
            description: true,
            smallDescription: true,
            duration: true,
            level: true,
            status: true,
            price: true,
            fileKey: true,
            slug: true,
            category: true,
            chapters: {
                select: {
                    id: true,
                    title: true,
                    position: true,
                    lessons: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            thumbnailKey: true,
                            videoKey: true,
                            position: true,
                        }
                    }
                }
            }
        }
    })

    if (!course) {
        return notFound()
    }

    return course
}

export type AdminCourseSingularType = Awaited<ReturnType<typeof AdminGetCourse>>