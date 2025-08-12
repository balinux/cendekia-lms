import { CourseSidebarType } from "@/app/data/course/get-course-sidebar";
import { useMemo } from "react";

interface iUseCourseProgress {
 courseData : CourseSidebarType["course"]   
}

interface CourseProgressResult{
    totalLessons: number;
    completedLessons: number;
    progressPercentage: number;
}
 
export default function useCourseProgress({courseData}: iUseCourseProgress): CourseProgressResult {
    return useMemo(() => {
        let totalLessons = 0;
        let completedLessons = 0;

        courseData.chapters.forEach((chapter) => {
            chapter.lessons.forEach((lesson) => {
                totalLessons++;

                // check if lesson is completed
                const isCompleted = lesson.lessonProgress.some(progress => progress.lessonId === lesson.id && progress.completed);
                 
                if (isCompleted) {
                    completedLessons++;
                }
            })
        })

        const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

        return {
            totalLessons,
            completedLessons,
            progressPercentage
        }
    }, [courseData])
}