import 'server-only';

import z from 'zod';
import { LessonSchema } from '../course/dto';

export const UpdateLessonTitleSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  chapterId: z.string(),
  title: z.string().min(1, 'Title is required').max(100),
});

export const DeleteLessonSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  chapterId: z.string(),
});

export const LessonOrderSchema = LessonSchema.pick({
  id: true,
  position: true,
});

export const ReorderLessonSchema = z.object({
  lessons: z.array(LessonOrderSchema),
  chapterId: z.string(),
  courseId: z.string(),
});

export type UpdateLessonTitleDTO = z.infer<typeof UpdateLessonTitleSchema>;
export type DeleteLessonDTO = z.infer<typeof DeleteLessonSchema>;
export type LessonOrderDTO = z.infer<typeof LessonOrderSchema>;
export type ReorderLessonDTO = z.infer<typeof ReorderLessonSchema>;
