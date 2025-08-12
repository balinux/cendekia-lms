"use client";

import { EnrolledCourseType } from "@/app/data/user/get-enrolled-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useConstructUrl from "@/hooks/use-construct-url";
import useCourseProgress from "@/hooks/use-course-progress";
import { School, TimerIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
  course: EnrolledCourseType;
}
export default function CourseProgressCard({ course }: iAppProps) {
  const thumbnailUrl = useConstructUrl(course.course.fileKey);

//   define course progress hook
const {totalLessons, completedLessons, progressPercentage} = useCourseProgress({courseData: course.course as any})

  return (
    <Card className="group relative py-0 gap-0">
      <Badge className="absolute top-2 right-2 z-10">{course.course.level}</Badge>
      <Image
        src={thumbnailUrl}
        alt="thumbnail image of course"
        className="w-full rounded-t-xl aspect-video object-cover h-full"
        width={600}
        height={400}
      />

      <CardContent className="p-4">
        <Link
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
          href={`/dashboard/${course.course.slug}`}
        >
          {course.course.title}
        </Link>

        {/* text desciption */}
        <p className="text-sm mt-2 line-clamp-2 text-muted-foreground leading-tight">
          {course.course.smallDescription}
        </p>

        {/* time */}
        <div className="space-y-4">
            <div className="flex justify-between mb-1">
                <p>Progress:</p>
                <p className="font-medium">{progressPercentage}</p>
            </div>
        </div>

        <Link
          href={`/dashboard/${course.course.slug }`}
          className={buttonVariants({
            className: "w-full mt-4",
          })}
        >
          Learn More
        </Link>
      </CardContent>
    </Card>
  );
}

export function PublicCourseCardSkeleton() {
  return (
    <Card className="group relative py-0 gap-0">
      <div className="absolute top-2 right-2 z-10 flex items-center">
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="w-full relative h-fit">
        <Skeleton className="w-full rounded-t-xl aspect-video" />
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>

        <div className=" mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>

        <Skeleton className="w-full mt-4 h-10 rounded-md" />
      </CardContent>
    </Card>
  );
}
