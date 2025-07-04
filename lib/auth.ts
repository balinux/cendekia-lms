import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { env } from "./env";
import { emailOTP } from "better-auth/plugins"
import { resend } from "./resend";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider:'postgresql'
    }),
    socialProviders:{
        github:{
            clientId:env.GITHUB_CLIENT_ID,
            clientSecret:env.GITHUB_CLIENT_SECRET,            
        }
    },
    plugins:[
        emailOTP({ 
            async sendVerificationOTP({ email, otp, type}) { 
                // Implement the sendVerificationOTP method to send the OTP to the user's email address
                const { data, error } = await resend.emails.send({
                    from: 'Cendekia <onboarding@resend.dev>',
                    to: [email],
                    subject: 'Cendekia - Verify your email',
                    // react: EmailTemplate({ firstName: 'John' }),
                    html:`<p>Your verification code is:</p>
                    <p>${otp}</p>
                    <p>Thank you for using Cendekia</p>`
                  });
            }, 
    }) 
    ]
})