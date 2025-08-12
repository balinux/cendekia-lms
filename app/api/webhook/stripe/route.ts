import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text();

    const headersList = await headers();

    const signature = headersList.get("Stripe-Signature") as string;

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            env.STRIPE_WEBHOOK_SECRET
        )
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return new Response("Webhook Error", {
            status: 400,
        })
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        const courseId = session.metadata?.courseId;
        const customerId = session.customer as string;

        if (!courseId) {
            return new Response("Course ID is not found", {
                status: 400,
            })
        }

        // check user
        const user = await prisma.user.findUnique({
            where: {
                stripeCustomerId: customerId,
            }
        })

        if (!user) {
            return new Response("User not found", {
                status: 404,
            })
        }

        // update enrollment
        await prisma.enrollment.update({
            where: {
                id: session.metadata?.enrollmentId as string,
            },
            data: {
                status: "Active",
                courseId: courseId,
                userId: user.id,
                amount: session.amount_total as number,
            }
        })
    }

    return new Response(null, {
        status: 200,
    })
}