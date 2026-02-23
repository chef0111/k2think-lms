import { deleteFiles } from './uploadthing';
import { createCourse, getCourse, listCourses, updateCourse } from './course';
import { updateChapterTitle, deleteChapter, reorderChapter } from './chapter';
import { updateLessonTitle, deleteLesson, reorderLesson } from './lesson';

export const router = {
  uploadthing: {
    delete: deleteFiles,
  },
  course: {
    create: createCourse,
    list: listCourses,
    get: getCourse,
    update: updateCourse,
  },
  chapter: {
    updateTitle: updateChapterTitle,
    delete: deleteChapter,
    reorder: reorderChapter,
  },
  lesson: {
    updateTitle: updateLessonTitle,
    delete: deleteLesson,
    reorder: reorderLesson,
  },
};
