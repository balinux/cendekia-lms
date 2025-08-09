import "server-only";

import Stripe from "stripe";
import { env } from "./env";

export const stripe = new Stripe(env.SRIPE_SECRET_KEY, {
    apiVersion: '2025-07-30.basil',
    typescript: true,
})