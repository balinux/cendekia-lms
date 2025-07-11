import { Card, CardContent } from "@/components/ui/card"
import { AdminGetCourcesType } from "@/data/admin/admin-get-cources"
import useConstructUrl from "@/hooks/use-construct-url"
import Image from "next/image"
import Link from "next/link"

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

            <CardContent>
                <Link 
                href={`admin/courses/${course.id}`}
                className="text-lg font-medium line-clamp-2 hover:underline group-hover:text-primary transition-colors"
                >
                    {course.title}
                </Link>
            </CardContent>
        </Card>
    )
}