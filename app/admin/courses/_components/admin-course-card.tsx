import { Card } from "@/components/ui/card"
import { AdminGetCourcesType } from "@/data/admin/admin-get-cources"
import useConstructUrl from "@/hooks/use-construct-url"
import Image from "next/image"

interface iAppProps{
    course: AdminGetCourcesType
}

export default function AdminCourseCard({course}: iAppProps) {
    const url = useConstructUrl(course.fileKey)
    return (
        <Card className=" group relative">
            <Image 
            src={url} 
            alt={course.title} 
            width={500} 
            height={500} 
            className="w-full h-full rounded-t-lg aspect-video object-cover"
            />
        </Card>
    )
}