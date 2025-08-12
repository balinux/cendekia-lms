import { getLessonContent } from "@/app/data/course/get-lesson-content"
import CourseContent from "./_components/course-content";
import { Suspense } from "react";
import LessonSkeleton from "./_components/lesson-skeleton";

type Params = Promise<{ lessonId: string }>

export default async function LessonContentPage({ params }: { params: Params }) {

    // get params
    const { lessonId } = await params;

return(
    <Suspense fallback={<LessonSkeleton />}>
        <LessonContentLoader lessonId={lessonId}/>
    </Suspense>
)}

export async function LessonContentLoader({ lessonId }: { lessonId: string }) {
    const data = await getLessonContent(lessonId)
    return <CourseContent lesson={data} />
}
