import CourseSidebar from "../_components/course-sidebar";
import getCourseSidebar from "@/app/data/course/get-course-sidebar";

interface iAppProps {
    params: Promise<{ slug: string }>
    children: React.ReactNode
}

export default async function CourseSlugLayout({children, params}: iAppProps) {
    const { slug } = await params

    // server-side security check and lightweight data fetching
    const course = await getCourseSidebar(slug)

    return (
        <div className="flex flex-1">
            {/* sidebar - 30% */}
            <div className="w-1/4 border-r border-border shrink-0">
            <CourseSidebar course={course.course} />
            </div>
            {/* main - 70% */}
            <div className="w-3/4 overflow-hidden" >
            {children}
            </div>
        </div>
    )
}