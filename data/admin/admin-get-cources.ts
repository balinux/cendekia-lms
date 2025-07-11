import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetCources() {
    await requireAdmin()

    const data = await prisma.course.findMany({
        orderBy:{
            createdAt:"desc"
        },
        select:{
            id:true,
            title:true,
            description:true,
            smallDescription:true,
            duration:true,
            level:true,
            status:true,
            price:true,
            fileKey:true
        }
    })

    return data
}

export type AdminGetCourcesType = Awaited<ReturnType<typeof adminGetCources>>[0]