import { deleteFiles } from './uploadthing';
import { createCourse, getCourse, listCourses, updateCourse } from './course';

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
};
