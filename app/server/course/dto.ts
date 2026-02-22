import 'server-only';

import z from 'zod';
import { CourseSchema } from '@/lib/validations';

export const GetCourseSchema = CourseSchema.extend({
  id: z.string(),
});

export const CourseListSchema = GetCourseSchema.omit({
  readme: true,
  category: true,
});

export const CoursesListSchema = z.object({
  courses: z.array(CourseListSchema),
  totalCourses: z.number(),
});

export type Course = z.infer<typeof CourseSchema>;
export type CourseListDTO = z.infer<typeof CourseListSchema>;
export type CoursesListDTO = z.infer<typeof CoursesListSchema>;
export type CourseDTO = z.infer<typeof GetCourseSchema>;
