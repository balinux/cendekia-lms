"use client";

import { CourseSidebarType } from "@/app/data/course/get-course-sidebar";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, Play } from "lucide-react";
import LessonItem from "./lesson-item";
import { usePathname } from "next/navigation";

interface iAppProps {
    course : CourseSidebarType["course"]
}
export default function CourseSidebar({ course }: iAppProps) {
    const pathname = usePathname()
    const currentLessonId = pathname.split("/").pop()
     
    return (
        <div className="flex flex-col h-full">
            <div className="pb-4 pr-4 border-b border-border">
                <div className="flex items-center gap-3 mb-3">
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Play className="size-4 text-primary" />
                    </div>
                    
                    {/* sidebar title and category */}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-base leading-tight truncate font-semibold">{course.title}</h1>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{course.category}</p>
                    </div>
                </div>

                {/* sidebar progress */}
                <div className="space-y-2">
                    <div className="flex text-xs justify-between">
                        <p className="text-muted-foreground">Progress</p>
                        <p className="font-semibold">4/10 lessons</p>
                    </div>
                    <Progress value={40} className="h-1.5"/>
                    <p className="text-xs text-muted-foreground">40% completed</p>
                </div>

                {/* sidebar lessons */}
                <div className="py-4 pr-4 space-y-3">
                    {course.chapters.map((chapter, index) => (
                        <Collapsible key={chapter.id} defaultOpen={index === 0}>
                            <CollapsibleTrigger asChild>
                            <Button
                            variant="outline"
                            className="w-full p-3 h-auto flex items-center gap-2"
                            >
                                <div className="shrink-0">
                                    <ChevronDown className="size-4" />
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                    <p className="text-sm font-semibold truncate text-foreground">{chapter.position}. {chapter.title}</p>
                                    <p className="text-xs text-muted-foreground font-medium truncate">{chapter.lessons.length} lessons</p>
                                </div>
                            </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-3 pl-6 border-l-2 space-y-3">
                                <div className="space-y-2">
                                    {chapter.lessons.map((lesson) => (
                                        <LessonItem key={lesson.id} lesson={{
                                            id: lesson.id,
                                            title: lesson.title,
                                            position: lesson.position,
                                            description: lesson.description || ""
                                        }} 
                                        slug={course.slug}
                                        isActive={lesson.id === currentLessonId}
                                        />
                                    ))}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    ))}
                </div>

            </div>
        </div>
    )
}