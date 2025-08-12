import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";
import adminGetEnrollmentStats from "../data/admin/admin-get-enrollment-stats";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import adminGetRecentCourse from "../data/admin/admin-get-recent-course";
import EmptyState from "@/components/general/empty-state";
import AdminCourseCard, { AdminCourseCardSkeleton } from "./courses/_components/admin-course-card";
import { Suspense } from "react";

export default async function AdminIndexPage() {
  const enrollmentdata = await adminGetEnrollmentStats()
  console.log(enrollmentdata)
  return (
    <>
      <SectionCards />
      <ChartAreaInteractive data={enrollmentdata} />
      {/* <DataTable data={data} /> */}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Course</h2>
          <Link
            className={buttonVariants({
              variant: "outline",
            })}
            href="/admin/course">View All Course</Link>
        </div>
        <Suspense fallback={<RenderRecentCourseSkeletonLayout />}>
          <RenderRecentCourse />
        </Suspense>
      </div>
    </>
  )
}

async function RenderRecentCourse() {
  const recentCourse = await adminGetRecentCourse()
  if (recentCourse.length === 0) {
    return <EmptyState 
    title={"no course found"} 
    description={"create a course to get started"} 
    buttonText={"create a course"} 
    href={"/admin/course/create"} />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {recentCourse.map((course) => (
        <AdminCourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}

// skeleton
function RenderRecentCourseSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  )
}