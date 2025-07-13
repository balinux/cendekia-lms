import { buttonVariants } from "@/components/ui/button";
import { adminGetCources } from "@/data/admin/admin-get-cources";
import Link from "next/link";
import AdminCourseCard from "./_components/admin-course-card";

export default async function CoursesPage() {
    const courses = await adminGetCources()
    return (
        <>
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Your Courses</h1>
            <Link className={buttonVariants()} href="/admin/courses/create">
                Create Course
            </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
            {courses.map((course) => (
                <AdminCourseCard key={course.id} course={course} />
            ))}
        </div>
        </>
    )
}