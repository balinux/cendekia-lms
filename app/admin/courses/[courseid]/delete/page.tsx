"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { tryCatch } from "@/hooks/try-catch";
import Link from "next/link";
import { useTransition } from "react";
import { deleteCourse } from "./action";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

export default function DeleteCourse() {
  const [ispending, startTransition] = useTransition();
  const { courseid } = useParams<{ courseid: string }>();
  const router = useRouter();

  function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(deleteCourse(courseid));
      if (error) {
        toast.error("unexpected error occured");
        return;
      }
      if (result.status === "success") {
        toast.success(result.message);
        router.push("/admin/courses");
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }
  return (
    <div className="max-w-xl mx-auto w-full">
      <Card className="mt-32">
        <CardHeader>
          <CardTitle>are you sure you want to delete this course?</CardTitle>
          <CardDescription>this action cannot be undone</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-end items-center gap-2">
          <Link
            href="/admin/courses"
            className={buttonVariants({ variant: "outline" })}
          >
            Cancel
          </Link>

          <Button variant="destructive" onClick={onSubmit} disabled={ispending}>
            {ispending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
