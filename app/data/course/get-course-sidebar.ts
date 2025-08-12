import "server-only";
import { requireUser } from "../user/require-user";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function getCourseSidebar(slug: string) {
    const session = await requireUser();

    const course = await prisma.course.findUnique({
        where: {
            slug: slug,
        },
        select: {
            id: true,
            title: true,
            slug: true,
            fileKey: true,
            level: true,
            duration: true,
            category: true,
            price: true,
            chapters: {
                orderBy: {
                    position: "asc"
                },
                select: {
                    id: true,
                    title: true,
                    position: true,
                    lessons: {
                        orderBy: {
                            position: "asc"
                        },
                        select: {
                            id: true,
                            title: true,
                            position: true,
                            description: true,
                            lessonProgress: {
                                where: {
                                    userId: session.id
                                },
                                select:{
                                     completed:true,
                                     lessonId:true,
                                     id:true
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    if (!course) {
        return notFound()
    }
    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId: session.id,
                courseId: course.id
            }
        }
    })

    if (!enrollment || enrollment.status !== "Active") {
        return notFound()
    }

    return {
        course,
    }

}

export type CourseSidebarType = Awaited<ReturnType<typeof getCourseSidebar>>;
