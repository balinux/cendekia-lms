import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminGetCourse from "@/app/data/admin/admin-get-course"
import { requireAdmin } from "@/app/data/admin/require-admin"
import { TabsContent } from "@radix-ui/react-tabs"
import EditCourseForm from "./_components/edit-course-form"
import CourseStructure from "./_components/course-structure"

type ParamsType = Promise<{courseid: string}>
    

export default async function EditCoursePage({params}: {params: ParamsType}) {
    await requireAdmin()

    const paramsData = await params
    const course = await AdminGetCourse(paramsData.courseid)
    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Edit Course <span className="text-primary underline">{course.title}</span></h1>
            
            <Tabs defaultValue="basic-info">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
                    <TabsTrigger value="course-structure">Course Structure</TabsTrigger>
                </TabsList>
                <TabsContent value="basic-info">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Info</CardTitle>
                            <CardDescription>Fill the form below to edit the course</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <EditCourseForm data={course} />
                        </CardContent>
                        </Card>    
                </TabsContent>
                <TabsContent value="course-structure">
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Structure</CardTitle>
                            <CardDescription>Fill the form below to edit the course</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CourseStructure course={course} />
                        </CardContent>
                        </Card>    
                </TabsContent>
            </Tabs>
        </div>
    )
}