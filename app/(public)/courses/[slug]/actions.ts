// action for enrollemnt

"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/lib/types";

interface EnrollCourseProps {
    courseId: string;
}
export async function enrollCourseAction({ courseId }: EnrollCourseProps): Promise<ApiResponse> {
    const user = await requireUser();
    try {
        const course = await prisma.course.findUnique({
            where: {
                id: courseId
            },
            select: {
                id: true,
                title: true,
                price: true,
                slug: true,
            },
        });

        // if not exitst
        if (!course) {
            return {
                status: "error",
                message: "Course not found",
            }
        }

        // get customer stripe id

        let stripeCustomerId: string;

        const userWithCustomerStripeId = await prisma.user.findUnique({
            where: {
                id: user.id
            },
            select: {
                stripeCustomerId: true
            }
        })
        if (userWithCustomerStripeId?.stripeCustomerId) {
            stripeCustomerId = userWithCustomerStripeId.stripeCustomerId;
        } else {
            // create customer id stripe if not exist
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: {
                    userId: user.id
                }
            })
            stripeCustomerId = customer.id;

            // update customer database
            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    stripeCustomerId: customer.id
                }
            })
        }

        return {
            status: "success",
            message: "Stripe customer id created",
        }

    } catch (error) {
        return {
            status: "error",
            message: "Failed to enroll course",
        }
    }
}
