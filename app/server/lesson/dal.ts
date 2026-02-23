import 'server-only';

import { prisma } from '@/lib/prisma';
import { LessonOrderDTO } from './dto';

export class LessonDAL {
  static async updateTitle(id: string, title: string) {
    return prisma.$transaction(async (tx) => {
      return tx.lesson.update({
        where: { id },
        data: { title },
      });
    });
  }

  static async delete(id: string, chapterId: string) {
    return prisma.$transaction(async (tx) => {
      await tx.lesson.delete({ where: { id } });

      const remaining = await tx.lesson.findMany({
        where: { chapterId },
        orderBy: { position: 'asc' },
        select: { id: true },
      });

      await Promise.all(
        remaining.map((lesson, index) =>
          tx.lesson.update({
            where: { id: lesson.id },
            data: { position: index },
          })
        )
      );
    });
  }

  static async updatePosition(lessons: LessonOrderDTO[], chapterId: string) {
    const updates = lessons.map((lesson) =>
      prisma.lesson.update({
        where: { id: lesson.id, chapterId },
        data: { position: lesson.position },
      })
    );

    return await prisma.$transaction(updates);
  }
}

export const updateTitle = (
  ...args: Parameters<typeof LessonDAL.updateTitle>
) => LessonDAL.updateTitle(...args);

export const deleteLesson = (...args: Parameters<typeof LessonDAL.delete>) =>
  LessonDAL.delete(...args);

export const updatePosition = (
  ...args: Parameters<typeof LessonDAL.updatePosition>
) => LessonDAL.updatePosition(...args);
