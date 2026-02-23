'use client';

import { useEffect, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DraggableSyntheticListeners,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CourseDTO } from '@/app/server/course/dto';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChapterCard } from './chapter-card';
import { LessonCard } from './lesson-card';
import { PlusIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useReorderLesson } from '@/queries/lesson';
import { useReorderChapter } from '@/queries/chapter';
import { orpc } from '@/lib/orpc';
import { useSuspenseQuery } from '@tanstack/react-query';

interface CourseStructureProps {
  courseId: string;
}

interface SortableItemProps {
  id: string;
  children: (listeners: DraggableSyntheticListeners) => React.ReactNode;
  className?: string;
  data?: {
    type: 'chapter' | 'lesson';
    chapterId?: string;
  };
}

type LessonItem = {
  id: string;
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  video?: string | null;
  order: number;
};

type ChapterItem = {
  id: string;
  title: string;
  order: number;
  isOpen: boolean;
  lessons: LessonItem[];
};

type ActiveItem =
  | { type: 'chapter'; id: string }
  | { type: 'lesson'; id: string; chapterId: string };

export const CourseStructure = ({ courseId }: CourseStructureProps) => {
  const { data } = useSuspenseQuery(
    orpc.course.get.queryOptions({ input: { id: courseId } })
  );

  const buildItems = (
    chapters: CourseDTO['chapters'],
    prev: ChapterItem[] = []
  ): ChapterItem[] =>
    chapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      order: chapter.position,
      isOpen: prev.find((item) => item.id === chapter.id)?.isOpen ?? true,
      lessons: chapter.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        thumbnail: lesson.thumbnail,
        video: lesson.video,
        order: lesson.position,
      })),
    }));

  const [items, setItems] = useState<ChapterItem[]>(() =>
    buildItems(data.chapters)
  );
  const [activeItem, setActiveItem] = useState<ActiveItem | null>(null);

  useEffect(() => {
    setItems((prev) => buildItems(data.chapters, prev));
  }, [data.chapters]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const reorderChapter = useReorderChapter(data.id);
  const reorderLesson = useReorderLesson(data.id);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const type = active.data.current?.type as 'chapter' | 'lesson';
    const chapterId = active.data.current?.chapterId as string | undefined;

    if (type === 'chapter') {
      setActiveItem({ type: 'chapter', id: active.id as string });
    } else if (type === 'lesson' && chapterId) {
      setActiveItem({ type: 'lesson', id: active.id as string, chapterId });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveItem(null);

    const { active, over } = event;
    const activeId = active.id;
    const overId = over?.id;

    if (!over || activeId === overId) return;

    const activeType = active.data.current?.type as 'chapter' | 'lesson';
    const overType = over.data.current?.type as 'chapter' | 'lesson';
    const courseId = data.id;

    if (activeType === 'chapter') {
      let targetChapterId: string | null = null;

      if (overType === 'chapter') {
        targetChapterId = overId as string;
      } else if (overType === 'lesson') {
        targetChapterId = over.data.current?.chapterId ?? null;
      }

      if (!targetChapterId) {
        toast.error('Could not determine the chapter');
        return;
      }

      const oldIndex = items.findIndex((item) => item.id === activeId);
      const newIndex = items.findIndex((item) => item.id === targetChapterId);

      if (oldIndex === -1 || newIndex === -1) {
        toast.error('Could not determine the chapter');
        return;
      }

      const reorderedChapters = arrayMove(items, oldIndex, newIndex);
      const updatedChapterState = reorderedChapters.map((chapter, index) => ({
        ...chapter,
        order: index + 1,
      }));

      const prevItems = [...items];
      setItems(updatedChapterState);

      const chaptersToUpdate = updatedChapterState.map((chapter) => ({
        id: chapter.id,
        position: chapter.order,
      }));

      const chapterPromise = reorderChapter.mutateAsync({
        chapters: chaptersToUpdate,
        courseId,
      });

      toast.promise(chapterPromise, {
        loading: 'Reordering chapters...',
        success: 'Chapters reordered successfully',
        error: () => {
          setItems(prevItems);
          return 'Failed to reorder chapters';
        },
      });

      return;
    }

    if (activeType === 'lesson' && overType === 'lesson') {
      const chapterId = active.data.current?.chapterId as string;
      const overChapterId = over.data.current?.chapterId as string;

      if (!chapterId || chapterId !== overChapterId) {
        toast.error('Lessons can only be reordered within the same chapter');
        return;
      }

      const chapterIndex = items.findIndex((c) => c.id === chapterId);
      if (chapterIndex === -1) return;

      const chapterToUpdate = items[chapterIndex];
      const oldLessonIndex = chapterToUpdate.lessons.findIndex(
        (l) => l.id === activeId
      );
      const newLessonIndex = chapterToUpdate.lessons.findIndex(
        (l) => l.id === overId
      );

      if (oldLessonIndex === -1 || newLessonIndex === -1) return;

      const reorderedLessons = arrayMove(
        chapterToUpdate.lessons,
        oldLessonIndex,
        newLessonIndex
      );
      const updatedLessonState = reorderedLessons.map((lesson, index) => ({
        ...lesson,
        order: index + 1,
      }));

      const newItems = [...items];
      newItems[chapterIndex] = {
        ...chapterToUpdate,
        lessons: updatedLessonState,
      };

      const prevItems = [...items];
      setItems(newItems);

      const lessonPromise = reorderLesson.mutateAsync({
        lessons: updatedLessonState.map((l) => ({
          id: l.id,
          position: l.order,
        })),
        chapterId,
        courseId,
      });

      toast.promise(lessonPromise, {
        loading: 'Reordering lessons...',
        success: 'Lessons reordered successfully',
        error: () => {
          setItems(prevItems);
          return 'Failed to reorder lessons';
        },
      });

      return;
    }
  };

  const toggleChapter = (chapterId: string) => {
    setItems((prev) =>
      prev.map((chapter) =>
        chapter.id === chapterId
          ? { ...chapter, isOpen: !chapter.isOpen }
          : chapter
      )
    );
  };

  const activeChapter =
    activeItem?.type === 'chapter'
      ? items.find((c) => c.id === activeItem.id)
      : null;

  const activeLesson =
    activeItem?.type === 'lesson'
      ? items
          .find((c) => c.id === activeItem.chapterId)
          ?.lessons.find((l) => l.id === activeItem.id)
      : null;

  return (
    <DndContext
      collisionDetection={rectIntersection}
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <Card className="rounded-lg pt-0">
        <CardHeader className="flex flex-row items-center justify-between border-b py-4!">
          <CardTitle className="text-lg">Chapters</CardTitle>
          <Button>
            <PlusIcon /> New chapter
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((item) => (
              <SortableItem
                key={item.id}
                id={item.id}
                data={{ type: 'chapter' }}
              >
                {(listeners) => (
                  <ChapterCard
                    data={item}
                    onOpenChange={() => toggleChapter(item.id)}
                    listeners={listeners}
                    courseId={data.id}
                  >
                    <SortableContext
                      items={item.lessons.map((lesson) => lesson.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {item.lessons.map((lesson) => (
                        <SortableItem
                          key={lesson.id}
                          id={lesson.id}
                          data={{ type: 'lesson', chapterId: item.id }}
                        >
                          {(lessonListeners) => (
                            <LessonCard
                              courseId={data.id}
                              chapterId={item.id}
                              data={lesson}
                              listeners={lessonListeners}
                            />
                          )}
                        </SortableItem>
                      ))}
                    </SortableContext>
                  </ChapterCard>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </CardContent>
      </Card>

      {/* The visual clone that follows the cursor during drag */}
      <DragOverlay dropAnimation={null}>
        {activeChapter && (
          <ChapterCard
            data={activeChapter}
            onOpenChange={() => {}}
            courseId={data.id}
          >
            {activeChapter.lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                courseId={data.id}
                chapterId={activeChapter.id}
                data={lesson}
              />
            ))}
          </ChapterCard>
        )}
        {activeLesson && activeItem?.type === 'lesson' && (
          <LessonCard
            courseId={data.id}
            chapterId={activeItem.chapterId}
            data={activeLesson}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
};

export const SortableItem = ({
  id,
  children,
  className,
  data,
}: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, data });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn('touch-none', isDragging && 'opacity-40', className)}
    >
      {children(listeners)}
    </div>
  );
};
