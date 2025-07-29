import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminGetCourcesType } from "@/app/data/admin/admin-get-cources";
import useConstructUrl from "@/hooks/use-construct-url";
import {
  ArrowRight,
  Eye,
  MoreVertical,
  Pencil,
  School,
  TimerIcon,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
  course: AdminGetCourcesType;
}

export default function AdminCourseCard({ course }: iAppProps) {
  const url = useConstructUrl(course.fileKey);
  return (
    <Card className=" group relative py-0 gap-0">
      {/* abosolute dropdown */}
      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${course.id}/edit`}>
                <Pencil className="size-4 mr-2" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/courses/${course.slug}`}>
                <Eye className="size-4 mr-2" />
                Preview
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${course.id}/delete`}>
                <Trash2 className="size-4 mr-2 text-destructive" />
                Delete
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Image
        src={url}
        alt={course.title}
        width={500}
        height={500}
        className="w-full h-full rounded-t-lg aspect-video object-cover"
      />

      <CardContent className="p-4">
        <Link
          href={`admin/courses/${course.id}`}
          className="text-lg font-medium line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {course.title}
        </Link>

        {/* small description */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-tight gap-x-5">
          {course.smallDescription}
        </p>

        {/* duration */}
        <div className="mt-4 flex items-center gap-x-5">
          <div className=" flex items-center gap-x-2">
            <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <span className="text-sm text-muted-foreground">
              {course.duration} hours
            </span>
          </div>

          {/* levle */}
          <div className=" flex items-center gap-x-2">
            <School className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <span className="text-sm text-muted-foreground">
              {course.level}
            </span>
          </div>
        </div>

        {/* link edit */}
        <Link
          className={buttonVariants({
            className: "w-full mt-4",
          })}
          href={`/admin/courses/${course.id}/edit`}
        >
          Edit Course <ArrowRight className="ml-2 size-4" />
        </Link>
      </CardContent>
    </Card>
  );
}

export function AdminCourseCardSkeleton() {
  return (
    <Card className="animate-pulse group relative py-0 gap-0">
      <div className="absolute top-2 right-2 z-10 flex itemcenter gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="size-8 rounded-md" />
      </div>
      <div className="w-full relative h-fit">
        <Skeleton className="w-full rounded-t-lg aspect-video h-[250px] object-cover" />
      </div>
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2 rounded" />
        <Skeleton className="h-4 w-full mb-4 rounded" />
        <div className="mt-4 flex items-center gap-x-5">
          <div className=" flex items-center gap-x-2">
            <Skeleton className="size-6 p-1 rounded-md" />
            <Skeleton className="h-4 w-10 rounded" />
          </div>
        </div>

        <Skeleton className="w-full mt-4 h-10 rounded" />
      </CardContent>
    </Card>
  );
}
