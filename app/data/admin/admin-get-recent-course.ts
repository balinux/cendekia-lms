import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export default async function adminGetRecentCourse() {
    await requireAdmin();

    const recentCourse = await prisma.course.findMany({
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            title: true,
            description: true,
            smallDescription: true,
            duration: true,
            level: true,
            status: true,
            price: true,
            fileKey: true,
            slug: true,
        },
        take: 3,
    })

    return recentCourse
}
