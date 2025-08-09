import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";
import { notFound } from "next/navigation";

export async function adminGetLesson(lessonId:string) {
    await requireAdmin()

    const data = await prisma.lesson.findUnique({
        where: {
            id: lessonId
        },
        select:{
            title:true,
            description:true,
            thumbnailKey:true,
            videoKey:true,
            position:true,
            id:true,
        }
    })

    if (!data) {
        return notFound()
    }

    return data
}

export type AdminLessonType = Awaited<ReturnType<typeof adminGetLesson>>