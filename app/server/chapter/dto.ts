import 'server-only';

import z from 'zod';

export const UpdateChapterTitleSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  title: z.string().min(1, 'Title is required').max(100),
});

export const DeleteChapterSchema = z.object({
  id: z.string(),
  courseId: z.string(),
});

export const ChapterOrderSchema = z.object({
  id: z.string(),
  position: z.number(),
});

export const ReorderChapterSchema = z.object({
  chapters: z.array(ChapterOrderSchema),
  courseId: z.string(),
});

export type UpdateChapterTitleDTO = z.infer<typeof UpdateChapterTitleSchema>;
export type DeleteChapterDTO = z.infer<typeof DeleteChapterSchema>;
export type ChapterOrderDTO = z.infer<typeof ChapterOrderSchema>;
export type ReorderChapterDTO = z.infer<typeof ReorderChapterSchema>;
