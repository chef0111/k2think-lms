import { orpc } from '@/lib/orpc';
import { CoursesListDTO } from '@/app/server/course/dto';
import { EMPTY_COURSE } from '@/common/constants/states';
import { DataRenderer } from '@/components/data-renderer';
import { NextPagination } from '@/components/ui/next-pagination';
import { resolveData, queryFetch } from '@/lib/query/helper';
import { getQueryClient } from '@/lib/query/hydration';
import CourseCard from '@/modules/admin/course/components/course-card';
import { GridLayout } from '@/modules/admin/course/layout/grid-layout';

export async function CourseList({
  searchParams,
}: Pick<RouteParams, 'searchParams'>) {
  const { page, pageSize, query, sort, filter } = await searchParams;

  const queryClient = getQueryClient();

  const queryOptions = orpc.course.list.queryOptions({
    input: {
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 6,
      query,
      sort,
      filter,
    },
  });

  const result = await queryFetch<CoursesListDTO>(
    queryClient.fetchQuery(queryOptions),
    'Failed to get courses'
  );

  const {
    data: courses,
    success,
    error,
  } = resolveData(result, (data) => data.courses, []);

  const { data: totalCourses } = resolveData(
    result,
    (data) => data.totalCourses,
    0
  );

  return (
    <>
      <DataRenderer
        data={courses}
        success={success}
        error={error}
        empty={EMPTY_COURSE}
        render={(courses) => (
          <GridLayout>
            {courses.map((course) => (
              <CourseCard key={course.id} data={course} />
            ))}
          </GridLayout>
        )}
      />
      <NextPagination
        page={page}
        pageSize={pageSize}
        totalCount={totalCourses}
        className="py-10"
      />
    </>
  );
}
