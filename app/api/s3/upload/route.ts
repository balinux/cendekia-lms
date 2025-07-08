import { env } from "@/lib/env";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import z from "zod";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3 } from "@/lib/s3-client";

export const fileUploadSchema = z.object({
    fileName: z.string().min(1, { message: "File name is required" }),
    fileType: z.string().min(1, { message: "File type is required" }),
    size: z.number().min(1, { message: "File size is required" }),
    isImage: z.boolean()
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const result = fileUploadSchema.safeParse(body)
        if (!result.success) {
            return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 })
        }

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
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
