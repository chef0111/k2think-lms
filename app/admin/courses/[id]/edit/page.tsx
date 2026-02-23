import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { orpc } from '@/lib/orpc';
import { getQueryClient } from '@/lib/query/hydration';
import { CourseForm } from '@/modules/admin/course/components/course-form';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function EditCourse({ params }: RouteParams) {
  const { id } = await params;
  const queryClient = getQueryClient();

  const queryOptions = orpc.course.get.queryOptions({
    input: { id },
  });

  const course = await queryClient.fetchQuery(queryOptions);

  return (
    <>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/courses">
            <ArrowLeft />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Edit Course</h1>
      </div>

      <Tabs defaultValue="basic" className="space-y-2">
        <TabsList className="h-10! w-full">
          <TabsTrigger value="basic" className="h-full text-base">
            Basic Information
          </TabsTrigger>
          <TabsTrigger value="structure" className="h-full text-base">
            Course Structure
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardContent className="space-y-8 px-4">
              <CardHeader className="px-4">
                <CardTitle className="text-2xl">Basic Information</CardTitle>
                <CardDescription>
                  Provide basic information about the course
                </CardDescription>
              </CardHeader>
              <CourseForm course={course} isEdit />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
