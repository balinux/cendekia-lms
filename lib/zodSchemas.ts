import { z } from "zod"

export const courseLevels = ["Beginner", "Intermediate", "Advanced"] as const;
export const courseStatus = ["Draft", "Published", "Archived"] as const;
export const courseCategories = ["All", "Web Development", "Mobile Development", "Data Science", "Machine Learning", "Artificial Intelligence", "Cybersecurity", "Business", "Design", "Marketing", "Health & Fitness", "Lifestyle", "Photography", "Music", "Sports", "Travel", "Entertainment", "Gaming", "Other"] as const;

export const courseSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long").max(100, "Title must be at most 100 characters long"),
    description: z.string().min(3, "Description must be at least 3 characters long"),
    fileKey: z.string().min(1, "File key must be at least 1 character long"),
    price: z.coerce.number().min(1, "Price must be at least 1"),
    duration: z.coerce.number().min(1, "Duration must be at least 1").max(500, "Duration must be at most 500"),
    level: z.enum(courseLevels, {
        message: "Level must be one of Beginner, Intermediate, or Advanced"
    }),
    category: z.enum(courseCategories, {
        message: "Category must be one of " + courseCategories.join(", ")
    }),
    smallDescription: z.string().min(3, "Small description must be at least 3 characters long").max(200, "Small description must be at most 200 characters long"),
    slug: z.string().min(3, "Slug must be at least 3 characters long"),
    status: z.enum(courseStatus, {
        message: "Status must be one of Draft, Published, or Archived"
    })
})

// schema for chapter
export const chapterSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    courseId: z.string().uuid({ message: "Course ID must be a valid UUID" }),
})

export type CourseSchemaType = z.infer<typeof courseSchema>;
export type ChapterSchemaType = z.infer<typeof chapterSchema>;

