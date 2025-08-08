import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";

interface UserIsEnrolledProps {
    courseId: string;
}

export default async function checkIfCourseBoughtByUser({ courseId }: UserIsEnrolledProps): Promise<boolean> {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user) {
        return false;
    }

    // check enrolled course by user
    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId: session.user.id,
                courseId: courseId
            }
        },
        select: {
            status: true
        }
    })

    return enrollment?.status === "Active" ? true : false;
}