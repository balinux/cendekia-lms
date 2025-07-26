import { adminGetLesson } from "@/data/admin/admin-get-lesson"
import LessonForm from "./_components/lesson-form"

type ParamsType = Promise<{ 
    courseid: string,
    chapterId: string,
    lessonId: string
 }>
    
export default async function LessonIdPage({ params }: { params: ParamsType }) {
    const { lessonId, chapterId, courseid } = await params
    const lesson  = await adminGetLesson(lessonId)
    return (
        <LessonForm lesson={lesson} chapterId={chapterId} courseId={courseid} />
    )
}