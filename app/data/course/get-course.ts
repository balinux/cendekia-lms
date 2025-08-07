// get singular course

import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function getCourse(slug: string) {
  const course = await prisma.course.findUnique({
    where: {
      slug: slug,
    },
    select: {
      title: true,
      id: true,
      price: true,
      description: true,
      smallDescription: true,
      slug: true,
      fileKey: true,
      level: true,
      duration: true,
      category: true,
      chapters: {
        select: {
          title: true,
          id: true,
          lessons: {
            select: {
              title: true,
              id: true,
            },
            orderBy: {
              position: "asc",
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return notFound();
  }
  return course;
}
