"use server"

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

interface UpdateLessonProgressProps {
    lessonId: string
    slug:string
}
export async function updateLessonProgress({lessonId, slug}: UpdateLessonProgressProps): Promise<ApiResponse> {
    const session = await requireUser();
    
    try {
        // cari - update/create lesson progress
        await prisma.lessonProgress.upsert({
            where:{
                userId_lessonId:{
                    userId: session.id,
                    lessonId:lessonId
                }
            },
            create:{
                lessonId:lessonId,
                userId:session.id,
                completed:true
            },
            update:{
                completed:true
            }
        })

        revalidatePath(`/dashboard/${slug}`)

        return {
            status: "success",
            message: "Lesson progress updated successfully"
        }
    } catch (error) {
        return {
            status: "error",
            message: "Failed to update lesson progress"
        }            
    }
}    
