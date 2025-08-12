"use client"

import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import {  useTransition } from "react";
import { enrollCourseAction } from "../actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface EnrollmentButtonProps {
    courseId: string;
}

export default function EnrollmentButton({ courseId }: EnrollmentButtonProps) {
    const [isPending, startTransition] = useTransition();
    // 2. Define a submit handler.
    function onSubmit() {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        // console.log(values)
        startTransition(async () => {
            const { data: results, error } = await tryCatch(enrollCourseAction({ courseId }));
            if (error) {
                toast.error(error.message);
            }

            if (results?.status === "success") {
                toast.success(results.message);
            } else if (results?.status === "error") {
                toast.error(results.message);
            }
        });
    }
    return (
        <Button type="submit" className="w-full" onClick={onSubmit} disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Enroll Now"}
        </Button>
    )
}