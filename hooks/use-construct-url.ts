import { env } from "@/lib/env"

export default function useConstructUrl(key: string): string {
    return `https:${env.NEXT_PUBLIC_S3_BUCKET_NAME}.fly.storage.tigris.dev/${key}`
}


