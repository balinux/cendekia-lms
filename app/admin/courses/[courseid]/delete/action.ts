"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

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


export async function deleteCourse(courseId: string): Promise<ApiResponse> {
  const session = await requireAdmin();
  try {

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
    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    revalidatePath("/admin/courses");

    return {
      status: "success",
      message: "Course deleted successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to delete course",
    };
  }
}
