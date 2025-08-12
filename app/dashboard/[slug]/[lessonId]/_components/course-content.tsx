"use client"

import { getLessonContentType } from "@/app/data/course/get-lesson-content";
import { RenderDescription } from "@/components/rich-text-editor/render-description";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import useConstructUrl from "@/hooks/use-construct-url";
import { BookIcon, CheckCircle, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { updateLessonProgress } from "../actions";
import { toast } from "sonner";
import { useConfetti } from "@/hooks/use-confetti";

interface CourseContentProps {
    lesson: getLessonContentType;
}

export default function CourseContent({ lesson }: CourseContentProps) {

    const [isPending, startTransition] = useTransition();
    const { triggerConfetti } = useConfetti()

    // function display video player
    function VideoPlayer({ thumbnailKey, videoKey }: { thumbnailKey: string, videoKey: string }) {
        const videoUrl = useConstructUrl(videoKey)
        const thumbnailUrl = useConstructUrl(thumbnailKey)

        if (!videoKey) {
            return (
                <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center">
                    <BookIcon className="size-16 text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">This lesson does not have a video</p>
                </div>
            )
        }

        return (
            <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
                <video
                    className="w-full h-full object-cover"
                    controls
                    poster={thumbnailUrl}
                >
                    <source src={videoUrl} type="video/mp4" />
                    <source src={videoUrl} type="video/ogg" />
                    <source src={videoUrl} type="video/webm" />
                    Your browser does not support the video tag.
                </video>
            </div>
        )
    }

    // 2. Define a submit handler.
    function onSubmit() {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        // console.log(values)
        startTransition(async () => {
            const { data: results, error } = await tryCatch(updateLessonProgress({ lessonId: lesson.id, slug: lesson.chapter.course.slug }));
            if (error) {
                toast.error(error.message);
            }

            if (results?.status === "success") {
                toast.success(results.message);
                triggerConfetti();
            } else if (results?.status === "error") {
                toast.error(results.message);
            }
        });
    }

    return (
        <div className="flex flex-col h-full bg-background pl-6">
            <VideoPlayer thumbnailKey={lesson.thumbnailKey || ""} videoKey={lesson.videoKey || ""} />
            <div className="py-4 border-b">
                {lesson.lessonProgress.length > 0 ? (
                    <Button variant="outline" className="bg-green-500/10 text-green-500 hover:text-green-500 hover:bg-green-500/20">
                        <CheckCircle className="size-4 mr-2" />
                        Completed
                    </Button>
                ) : (
                    <Button variant="outline" onClick={onSubmit} disabled={isPending}>
                        {isPending ? (
                            <Loader2 className="size-4 mr-2 animate-spin" />
                        ) : (
                            <CheckCircle className="size-4 mr-2 text-green-500" />
                        )}
                        Mark as Completed
                    </Button>
                )}

            </div>

            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{lesson.title}</h1>
                {lesson.description && (
                    <RenderDescription json={JSON.parse(lesson.description)} />
                )}
            </div>
        </div>
    )
}