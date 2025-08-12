import "server-only";

import { prisma } from "@/lib/db";
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
                                    lessonProgress:{
                                        where:{
                                            userId: user.id
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
            }
        }
    })

    return enrolledCourses;
}

export type EnrolledCourseType = Awaited<ReturnType<typeof getEnrolledCourses>>[0]