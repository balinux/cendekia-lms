import EmptyState from "@/components/general/empty-state"
import { getAllCourses } from "../data/course/get-all-courses"
import getEnrolledCourses from "../data/user/get-enrolled-courses"
import PublicCourseCard from "../(public)/courses/_components/public-course-card"

export default async function DashboardPage() {
  const [courses, enrolledCourses] = await Promise.all([
    getAllCourses(), getEnrolledCourses()
  ])
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Enrolled Courses</h1>
        <p className="text-muted-foreground">You have enrolled in {enrolledCourses.length} courses</p>
      </div>
      {enrolledCourses.length === 0 ? (
        <EmptyState title={"No Enrolled Courses"} description={"You have not enrolled in any courses yet"} buttonText={"Explore Courses"} href="/courses" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enrolledCourses.map((course) => (
            <PublicCourseCard key={course.course.id} course={course.course} />
          ))}
        </div>
      )}
      <section className="mt-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Available Courses</h1>
          <p className="text-muted-foreground">
            here you can see all the courses available for you to enroll in
          </p>
        </div>

        {
          courses.filter(
            (course) =>
              !enrolledCourses.some(
                ({ course: enrolled }) => enrolled.id === course.id
              )
          ).length === 0 ? (
            <EmptyState title={"No Available Courses"} description={"You have not enrolled in any courses yet"} buttonText={"Explore Courses"} href="/courses" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.filter(
                (course) =>
                  !enrolledCourses.some(
                    ({   course: enrolled }) => enrolled.id === course.id
                  )
              ).map((course) => (
                <PublicCourseCard key={course.id} course={course} />
              ))}
            </div>
          )
        }
      </section>
    </>
  )
}