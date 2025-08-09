import "server-only";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { requireUser } from "./require-user";

export default async function getEnrolledCourses() {
    const user = await requireUser();

    // get enrolled courses by user
    const enrolledCourses = await prisma.enrollment.findMany({
        where: {
            userId: user.id,
            status: "Active"
        },
        select: {
            course:{
                select: {
                    id: true,
                    smallDescription: true,
                    title: true,
                    slug: true,
                    fileKey: true,
                    level: true,
                    duration: true,
                    category: true,
                    price: true,
                    chapters:{
                        select:{
                            id: true,
                            lessons:{
                                select:{
                                    id: true,
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    return enrolledCourses;
}