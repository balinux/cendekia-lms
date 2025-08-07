import { buttonVariants } from "@/components/ui/button";
import { adminGetCources } from "@/app/data/admin/admin-get-cources";
import Link from "next/link";
import AdminCourseCard, {
  AdminCourseCardSkeleton,
} from "./_components/admin-course-card";
import EmptyState from "@/components/general/empty-state";
import { Suspense } from "react";

export default function CoursesPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Courses</h1>
        <Link className={buttonVariants()} href="/admin/courses/create">
          Create Course
        </Link>
      </div>
      <Suspense fallback={<AdminCourseCardSkeletonLayout />}>
        <RenderCourses />
      </Suspense>
    </>
  );
}

async function RenderCourses() {
  const courses = await adminGetCources();

  return (
    <>
      {courses.length === 0 ? (
        <EmptyState
          title="no courses found"
          description="Create a course to get started"
          buttonText="Create a course"
          href="/admin/courses/create"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <AdminCourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </>
  );
}

function AdminCourseCardSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-7">
      {Array.from({ length: 6 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
