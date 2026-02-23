import { admin } from '@/app/middleware/admin';
import { revalidatePath, revalidateTag } from 'next/cache';
import { writeSecurityMiddleware } from '@/app/middleware/arcjet/write';
import { standardSecurityMiddleware } from '@/app/middleware/arcjet/standard';
import {
  UpdateChapterTitleSchema,
  DeleteChapterSchema,
  ReorderChapterSchema,
} from './dto';
import {
  updateTitle,
  deleteChapter as deleteChapterDAL,
  updatePosition,
} from './dal';

export const updateChapterTitle = admin
  .use(standardSecurityMiddleware)
  .use(writeSecurityMiddleware)
  .input(UpdateChapterTitleSchema)
  .handler(async ({ input }) => {
    const { id, courseId, title } = input;
    await updateTitle(id, title);

    revalidateTag(`course:${courseId}`, 'max');
    revalidateTag(`chapter:${id}`, 'max');
    revalidatePath(`/admin/courses/${courseId}/edit`);
  });

export const deleteChapter = admin
  .use(standardSecurityMiddleware)
  .use(writeSecurityMiddleware)
  .input(DeleteChapterSchema)
  .handler(async ({ input }) => {
    const { id, courseId } = input;
    await deleteChapterDAL(id, courseId);

    revalidateTag(`course:${courseId}`, 'max');
    revalidatePath(`/admin/courses/${courseId}/edit`);
  });

export const reorderChapter = admin
  .use(standardSecurityMiddleware)
  .use(writeSecurityMiddleware)
  .input(ReorderChapterSchema)
  .handler(async ({ input }) => {
    const { chapters, courseId } = input;
    await updatePosition(chapters, courseId);

    revalidateTag(`course:${courseId}`, 'max');
    chapters.forEach((chapter) => {
      revalidateTag(`chapter:${chapter.id}`, 'max');
    });
    revalidatePath(`/admin/courses/${courseId}/edit`);
  });
