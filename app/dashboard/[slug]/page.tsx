import getCourseSidebar from "@/app/data/course/get-course-sidebar";
import { redirect } from "next/navigation";

interface CourseSlugProps {
    params: Promise<{slug:string}>
}

export default async function CoureSlugRoute({params}: CourseSlugProps) {
    const {slug} = await params;

    const course = await getCourseSidebar(slug)
 
    const firstChapter = course.course.chapters[0]
    const firstLesson = firstChapter.lessons[0]

    if (firstLesson) {
        redirect(`/dashboard/${slug}/${firstLesson.id}`)
    }
    return (
            <div className="flex items-center justify-center h-full text-center">
                <h2 className="text-2xl font-bold mb-2"> No lesson found</h2>
                <p className="text-muted-foreground">
                    this course has no lesson yet
                </p>
            </div>
    )
}