import "server-only";
import { requireUser } from "../user/require-user";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
export async function getLessonContent(lessonId: string) {
    // get session
    const session = await requireUser();

    // get lesson
    const lesson = await prisma.lesson.findUnique({
        where: {
            id: lessonId
        },
        select:{
            id:true,
            title:true,
            description:true,
            thumbnailKey:true,
            videoKey:true,
            position:true,
            chapter:{
                select:{
                    courseId:true
                }
            }
        }
    })

    if (!lesson) {
        return notFound()
    }

    // check in is user enrolled in this course
    const enrolled = await prisma.enrollment.findUnique({
        where: {
            userId_courseId:{
                userId: session.id,
                courseId: lesson.chapter.courseId
            }
        },
        select:{
            status:true
        }
    })

    if (!enrolled || enrolled.status !== "Active") {
        return notFound()
    }

    return lesson;
}

export type getLessonContentType = Awaited<ReturnType<typeof getLessonContent>>