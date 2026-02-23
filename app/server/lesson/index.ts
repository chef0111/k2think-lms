import { admin } from '@/app/middleware/admin';
import { revalidatePath, revalidateTag } from 'next/cache';
import { writeSecurityMiddleware } from '@/app/middleware/arcjet/write';
import { standardSecurityMiddleware } from '@/app/middleware/arcjet/standard';
import {
  UpdateLessonTitleSchema,
  DeleteLessonSchema,
  ReorderLessonSchema,
} from './dto';
import {
  updateTitle,
  deleteLesson as deleteLessonDAL,
  updatePosition,
} from './dal';

export const updateLessonTitle = admin
  .use(standardSecurityMiddleware)
  .use(writeSecurityMiddleware)
  .input(UpdateLessonTitleSchema)
  .handler(async ({ input }) => {
    const { id, courseId, title } = input;
    await updateTitle(id, title);

    revalidateTag(`course:${courseId}`, 'max');
    revalidatePath(`/admin/courses/${courseId}/edit`);
  });

export const deleteLesson = admin
  .use(standardSecurityMiddleware)
  .use(writeSecurityMiddleware)
  .input(DeleteLessonSchema)
  .handler(async ({ input }) => {
    const { id, courseId, chapterId } = input;
    await deleteLessonDAL(id, chapterId);

    revalidateTag(`course:${courseId}`, 'max');
    revalidatePath(`/admin/courses/${courseId}/edit`);
  });

export const reorderLesson = admin
  .use(standardSecurityMiddleware)
  .use(writeSecurityMiddleware)
  .input(ReorderLessonSchema)
  .handler(async ({ input }) => {
    const { lessons, chapterId, courseId } = input;
    await updatePosition(lessons, chapterId);

    revalidateTag(`course:${courseId}`, 'max');
    revalidateTag(`chapter:${chapterId}`, 'max');
    revalidatePath(`/admin/courses/${courseId}/edit`);
  });
