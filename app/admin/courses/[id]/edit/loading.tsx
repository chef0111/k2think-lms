import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { TabsList, TabsTrigger, TabsContent, Tabs } from '@/components/ui/tabs';
import { CourseForm } from '@/modules/admin/course/components/course-form';
import { ArrowLeft } from 'lucide-react';

export default function EditCourse() {
  return (
    <>
      <div className="flex items-center gap-4">
        <Button type="button" variant="outline" size="icon">
          <ArrowLeft />
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
              <CourseForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
