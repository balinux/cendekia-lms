// action for enrollemnt

"use server";

import { requireUser } from "@/app/data/user/require-user";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/lib/types";
import { request } from "@arcjet/next";
import { redirect } from "next/navigation";
import { env } from "process";
import Stripe from "stripe";

interface EnrollCourseProps {
    courseId: string;
}

const aj = arcjet.withRule(
    detectBot({
        mode: "LIVE",
        allow: []
    })
)
    .withRule(
        fixedWindow({
            mode: "LIVE",
            window: "1m",
            max: 5
        })
    )

export async function enrollCourseAction({ courseId }: EnrollCourseProps): Promise<ApiResponse | never> {
    const user = await requireUser();
    let checkoutUrl: string;
    try {

        // Access request data that Arcjet needs when you call `protect()` similarly
        // to `await headers()` and `await cookies()` in `next/headers`
        const req = await request();

        // call arcjet protect
        const decision = await aj.protect(req, {
            fingerprint: user.id as string
        })

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return {
                    status: "error",
                    message: "Too many requests",
                }
            } else if (decision.reason.isBot()) {
                return {
                    status: "error",
                    message: "you are a bot, if you think this is a mistake, please contact support",
                }
            } else {
                return {
                    status: "error",
                    message: "you are a bot, if you think this is a mistake, please contact support",
                }
            }
        }

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
                    stripeCustomerId: stripeCustomerId
                }
            })
        }

        const result = await prisma.$transaction(async (tx) => {
            // check apakah sudah enroll course ini
            const existingEnrollment = await tx.enrollment.findUnique({
                where: {
                    userId_courseId: {
                        userId: user.id,
                        courseId: course.id
                    }
                },
                select: {
                    status: true,
                    id: true
                }
            })

            if (existingEnrollment?.status === "Active") {
                return {
                    status: "error",
                    message: "You are already enrolled in this course",
                }
            }

            let enrollment;
            if (existingEnrollment) {
                enrollment = await tx.enrollment.update({
                    where: {
                        id: existingEnrollment.id
                    },
                    data: {
                        status: "Pending",
                        amount: course.price,
                        updatedAt: new Date()
                    }
                })
            } else {
                enrollment = await tx.enrollment.create({
                    data: {
                        userId: user.id,
                        courseId: course.id,
                        status: "Pending",
                        amount: course.price,
                        updatedAt: new Date()
                    }
                })
            }

            // checkout section
            const checkoutSession = await stripe.checkout.sessions.create({
                customer: stripeCustomerId,
                line_items: [
                    {
                        price: "price_1RtfbOQk8wx8D4EoEB0sxWNB",
                        quantity: 1,
                    },
                ],
                mode: "payment",
                success_url: `${env.BETTER_AUTH_URL}/payment/success`,
                cancel_url: `${env.BETTER_AUTH_URL}/payment/cancel`,
                metadata: {
                    userId: user.id,
                    courseId: course.id,
                    enrollmentId: enrollment.id
                }
            })

            return {
                enrollment: enrollment,
                checkoutUrl: checkoutSession.url,
            }

        })

        checkoutUrl = result.checkoutUrl as string;

    } catch (error) {
        if (error instanceof Stripe.errors.StripeError) {
            return {
                status: "error",
                message: "Payment system error. please try again later.",
            }
        }
        return {
            status: "error",
            message: "Failed to enroll course",
        }
    }

    redirect(checkoutUrl);
}
