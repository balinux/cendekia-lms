"use server"

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { CourseSchemaType } from "@/lib/zodSchemas";
import { courseSchema } from "@/lib/zodSchemas";
import { headers } from "next/headers";

export async function CreateCourse(values: CourseSchemaType): Promise<ApiResponse> {
 try {
    // get user from session auth
    const session = await auth.api.getSession({
        headers: await headers()
    })
    // validate values
    const validatedValues = courseSchema.safeParse(values);

    if (!validatedValues.success) {
        return{
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
