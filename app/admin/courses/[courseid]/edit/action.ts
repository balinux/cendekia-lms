"use server"

import { requireAdmin } from "@/data/admin/require-admin"
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet"
import { prisma } from "@/lib/db"
import { ApiResponse } from "@/lib/types"
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas"
import { request } from "@arcjet/next"

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