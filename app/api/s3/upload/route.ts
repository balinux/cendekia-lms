import { env } from "@/lib/env";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3 } from "@/lib/s3-client";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { fileUploadSchema } from "@/lib/zodSchemas";



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

export async function POST(req: Request) {

    const session = await requireAdmin();
    try {
        // let acjet protect route
        const decision = await aj.protect(req, {
            fingerprint: session?.user.id as string
        })

        if (decision.isDenied()) {
            return NextResponse.json({ error: "Too many requests" }, { status: 429 })
        }

        const body = await req.json()
        const result = fileUploadSchema.safeParse(body)
        if (!result.success) {
            return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 })
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { fileName, fileType, size, isImage } = result.data;

        // generate key
        const uniqueKey = `${uuidv4()}-${fileName}`

        const command = new PutObjectCommand({
            Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME,
            Key: uniqueKey,
            ContentType: fileType,
            ContentLength: size,
        })

        // sign url
        const presignedUrl = await getSignedUrl(S3, command, {
            expiresIn: 60 * 60 // 1 hour
        })

        return NextResponse.json({
            presignedUrl,
            fileKey: uniqueKey
        })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}