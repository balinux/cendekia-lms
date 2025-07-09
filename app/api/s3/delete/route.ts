import { env } from "@/lib/env"
import { S3 } from "@/lib/s3-client"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { NextResponse } from "next/server"

export async function DELETE(req: Request) {
    try {
        const body = await req.json()
        const key = body.key

        if (!key) {
            return NextResponse.json({ error: "Key is required" }, { status: 400 })
        }

        // Delete object
        const command = new DeleteObjectCommand({
            Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME,
            Key: key,
        })

        await S3.send(command)

        return NextResponse.json({ message: "File deleted successfully" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
