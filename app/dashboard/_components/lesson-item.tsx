import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Play } from "lucide-react";
import Link from "next/link";

interface iLessonItemProps {
    lesson: {
        id: string;
        title: string;
        position: number;
        description: string;
    },
    slug: string,
    isActive?: boolean
    completed: boolean
}

export default function LessonItem({ lesson, slug, isActive, completed }: iLessonItemProps) {
    return (
        <Link
            href={`/dashboard/${slug}/${lesson.id}`}
            className={buttonVariants({
                variant: completed ? "secondary" : "outline",
                className: cn("w-full p-2.5 h-auto justify-start transition-all",
                    completed && "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-800 text-green-800 dark:text-green-200",

                    isActive && !completed && "bg-primary/10 dark:bg-primary/20 border-primary/50 hover:bg-primary/20 dark:hover:bg-primary/30 text-primary-foreground"
                )
            })}
        >
            <div className="flex items-center gap-2 w-full min-w-0">
                <div className="shrink-0">
                    <div className={cn("size-5 rounded-full border-2 bg-background flex justify-center items-center",
                        isActive && "border-primary/50 hover:bg-primary/20 dark:hover:bg-primary/30 text-primary-foreground"
                    )}>
                        {completed ?
                            <Check className="size-3 rounded-full bg-green-600 dark:bg-green-500 flex items-center justify-center" />
                            :
                            <Play className={cn("size-3 rounded-full bg-background flex items-center justify-center", isActive ? "text-primary dark:text-primary-foreground" : "text-muted-foreground")} />}
                    </div>
                </div>
                <div className="flex-1 min-w-0 text-left">
                    <p
                        className={cn(
                            "text-sm font-semibold truncate text-foreground",
                            completed ? "text-green-800 dark:text-green-200" : isActive ? "text-primary dark:text-primary-foreground font-semibold" : "text-foreground")}  >
                        {lesson.position}. {lesson.title}</p>
                    {
                        completed && <p className="text-xs text-green-700 dark:text-green-300">Completed</p>}

                        {isActive && !completed && <p className="text-xs text-primary dark:text-primary-foreground">Currently Watching</p>}
                </div>
            </div>
        </Link>
    )
}