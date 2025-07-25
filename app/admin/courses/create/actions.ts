"use server"

import { requireAdmin } from "@/data/admin/require-admin";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { CourseSchemaType } from "@/lib/zodSchemas";
import { courseSchema } from "@/lib/zodSchemas";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { request } from "@arcjet/next";

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

export async function CreateCourse(values: CourseSchemaType): Promise<ApiResponse> {

    // set ession
    const session = await requireAdmin();
    try {
        // get user from session auth
        // const session = await auth.api.getSession({
        //     headers: await headers()
        // })

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

        // validate values
        const validatedValues = courseSchema.safeParse(values);

        if (!validatedValues.success) {
            return {
                status: "error",
                message: "Invalid form data",
            }
        }

        // create course
        const course = await prisma.course.create({
            data: {
                ...validatedValues.data,
                userId: session?.user.id as string,
            },
        });

        return {
            status: "success",
            message: "Course created successfully",
        };
    } catch (error) {
        console.log(error)
        return {
            status: "error",
            message: "Failed to create course",
        };
    }
}
