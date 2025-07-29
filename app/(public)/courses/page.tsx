import { getAllCourses } from "@/app/data/course/get-all-courses";
import PublicCourseCard, {
  PublicCourseCardSkeleton,
} from "./_components/public-course-card";
import { Suspense } from "react";

export default function PublicCourses() {
  return (
    <div className="mt-5">
      <div className="flex flex-col space-y-2 mb-10">
        <h1 className="text-3xl font-bold md:text-4xl tracking-tighter">
          Explore Courses
        </h1>
        <p className="text-muted-foreground max-w-md">
          Discover a wide range of courses to enhance your skills and knowledge.
        </p>
      </div>
      <Suspense fallback={<LoadingSkeletonLayout />}>
        <RenderCourses />
      </Suspense>
    </div>
  );
}

async function RenderCourses() {
  const courses = await getAllCourses();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <PublicCourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}

function LoadingSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, index) => (
        <PublicCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
