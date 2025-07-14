
"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AdminCourseSingularType } from "@/data/admin/admin-get-course";
import { cn } from "@/lib/utils";
import { DndContext, rectIntersection, useSensors, useSensor, MouseSensor, TouchSensor, KeyboardSensor, DraggableSyntheticListeners } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { ChevronDown, ChevronUp, FileText, GripVertical, PlusIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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

    function handleDragEnd(event: { active: any; over: any; }) {
        const { active, over } = event;

        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
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
                <CardContent>
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
                                                        <Button variant="outline" className="w-full hover:bg-primary hover:text-primary" > <PlusIcon className="size-4" /> New Lesson</Button>
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