
"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AdminCourseSingularType } from "@/data/admin/admin-get-course";
import { cn } from "@/lib/utils";
import { DndContext, rectIntersection, useSensors, useSensor, MouseSensor, TouchSensor, KeyboardSensor, DraggableSyntheticListeners, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { ChevronDown, ChevronUp, FileText, GripVertical, PlusIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { reOrderChapter, reOrderLesson } from "../action";

interface iAppProps {
    course: AdminCourseSingularType
}

interface SortableItemProps {
    id: string;
    children: (listeners: DraggableSyntheticListeners) => React.ReactNode;
    className?: string;
    data?: {
        type: 'chapter' | 'lesson',
        chapterId?: string,
    };
}

export default function CourseStructure({ course }: iAppProps) {

    const initialItems = course.chapters.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        order: chapter.position,
        isOpen: true,
        lessons: chapter.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            order: lesson.position,
        }))
    })) || [];

    const [items, setItems] = useState(initialItems);

    console.log(items)

    // resync
    useEffect(() => {
        setItems((prevItems) => {
            const updateItems = course.chapters.map((chapter) => ({
                id: chapter.id,
                title: chapter.title,
                order: chapter.position,
                isOpen: prevItems.find((item) => item.id === chapter.id)?.isOpen || true,
                lessons: chapter.lessons.map((lesson) => ({
                    id: lesson.id,
                    title: lesson.title,
                    order: lesson.position,
                }))
            })) || []
            return updateItems
        })
    }, [course])

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const activeId = active.id;
        const overId = over.id;
        const activeType = active.data?.current?.type as 'chapter' | 'lesson';
        const overType = over.data?.current?.type as 'chapter' | 'lesson';
        const courseId = course.id;

        if (activeType === 'chapter') {
            let targetChapterId = null;
            if (overType === 'chapter') {
                targetChapterId = overId;
            } else if (overType === 'lesson') {
                targetChapterId = over.data?.current?.chapterId;
            }

            if (!targetChapterId) {
                toast.error('Failed to move chapter')
                return;
            }

            const oldIndex = items.findIndex((item) => item.id === activeId);
            const newIndex = items.findIndex((item) => item.id === targetChapterId);

            if (oldIndex === -1 || newIndex === -1) {
                toast.error('Failed to move chapter')
                return;
            }

            const reorderLocalChapters = arrayMove(items, oldIndex, newIndex);
            const updateChapterForState = reorderLocalChapters.map(
                (chapter, index) => ({
                    ...chapter,
                    order: index + 1,
                })
            )

            const previousItems = [...items];
            setItems(updateChapterForState);

            if (courseId) {
                const chaptersToUpdate = updateChapterForState.map((chapter) => ({
                    id: chapter.id,
                    position: chapter.order,
                }))

                const reOrderChapterResponse = () => reOrderChapter({ chapters: chaptersToUpdate, courseId })

                toast.promise(
                    reOrderChapterResponse(),
                    {
                        loading: 'Reordering chapters...',
                        success: (result) => {
                            if (result.status === 'success') {
                                return result.message
                            } else {
                                throw new Error(result.message)
                            }
                        },
                        error: () => {
                            setItems(previousItems)
                            return 'Failed to reorder chapters'
                        }
                    }
                )
            }
            return;
        }

        if (activeType === 'lesson' && overType === 'lesson') {
            const chapterId = active.data.current?.chapterId;
            const overChapterId = over.data.current?.chapterId;

            if (!chapterId || chapterId !== overChapterId) {
                toast.error('Lesson move between chapters is not allowed')
                return;
            }

            const chapterIndex = items.findIndex((chapter) => chapter.id === chapterId);

            if (chapterIndex === -1) {
                toast.error('Could not find chapter for lesson')
                return;
            }

            const chapterToUpdate = items[chapterIndex];
            const oldLessonIndex = chapterToUpdate.lessons.findIndex((lesson) => lesson.id === activeId);
            const newLessonIndex = chapterToUpdate.lessons.findIndex((lesson) => lesson.id === overId);

            if (oldLessonIndex === -1 || newLessonIndex === -1) {
                toast.error('Could not find lesson for reorder')
                return;
            }

            const reorderLocalLessons = arrayMove(chapterToUpdate.lessons, oldLessonIndex, newLessonIndex);
            const updateLessonForState = reorderLocalLessons.map(
                (lesson, index) => ({
                    ...lesson,
                    order: index + 1,
                })
            )

            const newItems = [...items];
            newItems[chapterIndex] = {
                ...chapterToUpdate,
                lessons: updateLessonForState,
            }

            const previousItems = [...items];
            setItems(newItems);

            if (courseId) {
                const lessonsToUpdate = updateLessonForState.map((lesson) => ({
                    id: lesson.id,
                    position: lesson.order,
                }))

                const reOrderLessonResponse = () => reOrderLesson({ chapterId, lessons: lessonsToUpdate, courseId })

                toast.promise(
                    reOrderLessonResponse(),
                    {
                        loading: 'Reordering lessons...',
                        success: (result) => {
                            if (result.status === 'success') {
                                return result.message
                            } else {
                                throw new Error(result.message)
                            }
                        },
                        error: () => {
                            setItems(previousItems)
                            return 'Failed to reorder lessons'
                        }
                    }
                )
            }

            return;
        }

        // if (active.id !== over.id) {
        //     setItems((items) => {
        //         const oldIndex = items.indexOf(active.id);
        //         const newIndex = items.indexOf(over.id);

        //         return arrayMove(items, oldIndex, newIndex);
        //     });
        // }
    }

    function toggleChapter(chapterId: string) {
        setItems(items.map((chapter) => chapter.id === chapterId ? { ...chapter, isOpen: !chapter.isOpen } : chapter))
    }

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        }),
    );

    function SortableItem({ id, children, className, data }: SortableItemProps) {
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
            isDragging
        } = useSortable({ id, data });

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
        };

        return (
            <div ref={setNodeRef} style={style} {...attributes} className={cn('touch-none', className, isDragging ? 'z-10' : '')}>
                {children(listeners)}
            </div>
        );
    }

    return (
        <DndContext collisionDetection={rectIntersection} onDragEnd={handleDragEnd} sensors={sensors}>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between border-b border-border">
                    <CardTitle>Chapters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    <SortableContext items={items} strategy={verticalListSortingStrategy}>
                        {items.map((item) => (
                            <SortableItem key={item.id} id={item.id} data={{ type: 'chapter' }} >
                                {(listeners) => (
                                    <Card>
                                        <Collapsible open={item.isOpen} onOpenChange={() => toggleChapter(item.id)}>
                                            <div className="flex items-center justify-between p-3 border-b border-border">
                                                <div className="flex items-center gap-2">
                                                    <Button size='icon' variant="ghost" className="cursor-grab opacity-60 hover:opacity-100" {...listeners}>
                                                        <GripVertical className="size-4" />
                                                    </Button>
                                                    <CollapsibleTrigger asChild >
                                                        <Button size='icon' variant="ghost" className="flex items-center">
                                                            {
                                                                item.isOpen ? (
                                                                    <ChevronUp className="size-4" />
                                                                ) : (
                                                                    <ChevronDown className="size-4" />
                                                                )
                                                            }
                                                        </Button>
                                                    </CollapsibleTrigger>
                                                    <span className="cursor-pointer hover:text-primary pl-2">{item.title}</span>
                                                </div>
                                                <Button size='icon' variant="outline" className="cursor-pointer opacity-60 hover:opacity-100" {...listeners}>
                                                    <Trash2 className="size-4 " />
                                                </Button>
                                            </div>

                                            {/* component collapsible */}
                                            <CollapsibleContent>
                                                <div className="p-1">
                                                    <SortableContext
                                                        items={item.lessons.map((lesson) => lesson.id)}
                                                        strategy={verticalListSortingStrategy}>
                                                        {item.lessons.map((lesson) => (
                                                            <SortableItem
                                                                key={lesson.id}
                                                                id={lesson.id}
                                                                data={{ type: 'lesson', chapterId: item.id }}
                                                                className="mb-2"
                                                            >
                                                                {(listeners) => (
                                                                    <div className="flex items-center justify-between p-2 bg-accent rounded-sm">
                                                                        <div className="flex items-center gap-2">
                                                                            <Button size='icon' variant="ghost" className="cursor-grab opacity-60 hover:opacity-100" {...listeners}>
                                                                                <GripVertical className="size-4" />
                                                                            </Button>
                                                                            <FileText className="size-4" />
                                                                            <Link href={`/admin/courses/${course.id}/${item.id}/${lesson.id}`}>
                                                                                <span className="cursor-pointer hover:text-primary pl-2">{lesson.title}</span>
                                                                            </Link>
                                                                        </div>
                                                                        <Button size='icon' variant="outline" className="cursor-pointer opacity-60 hover:opacity-100" {...listeners}>
                                                                            <Trash2 className="size-4 " />
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </SortableItem>
                                                        ))}
                                                    </SortableContext>
                                                    {/* button new lesson */}
                                                    <div className="p-2">
                                                        <Button variant="outline" className="w-full hover:bg-primary hover:text-primary" ><PlusIcon className="size-4" /> New Lesson</Button>
                                                    </div>
                                                </div>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    </Card>
                                )}
                            </SortableItem>
                        ))}
                    </SortableContext>
                </CardContent>
            </Card>
        </DndContext>
    )
}