import { cn } from "@/lib/utils";
import { CloudUploadIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

interface RenderEmptyStateProps {
    isDragActive: boolean;
}

interface RenderUploadedStateProps {
    previewUrl: string;
}

interface RenderUploadingStateProps {
    progress: number
    file: File
}


export function RenderEmptyState({ isDragActive }: RenderEmptyStateProps) {
    return (
        <div className="text-center">
            <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-4">
                <CloudUploadIcon
                    className={cn(
                        "size-6 text-muted-foreground",
                        isDragActive ?? "text-primary"
                    )}
                />
            </div>
            <p>{isDragActive ? "Drop the files here ..." : "Drag 'n' drop some files here, or "} <span className="text-primary cursor-pointer">click to select files</span></p>
        </div>
    )
}

export function RenderErrorState({ isDragActive }: RenderEmptyStateProps) {
    return (
        <div className="text-center">
            <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-4">
                <CloudUploadIcon
                    className={cn(
                        "size-6 text-muted-foreground",
                        isDragActive ?? "text-primary"
                    )}
                />
            </div>
            <p>{isDragActive ? "Drop the files here ..." : "Drag 'n' drop some files here, or "} <span className="text-primary cursor-pointer">click to select files</span></p>
        </div>
    )
}

export function RenderUploadedState({ previewUrl }: RenderUploadedStateProps) {
    return (
        <div>
            <Image src={previewUrl} alt="uploaded file" fill className="object-contain p-2 " />
            <Button variant="destructive" size="icon" className={cn(
                "absolute top-4 right-4"
            )}>
                <XIcon className="size-4" />

            </Button>
        </div>
    )
}

// render uploading
export function RenderUploadingState({ progress, file }: RenderUploadingStateProps) {
    return (
        <div className="text-center flex justify-center items-center flex-col">
            <p>{progress}%</p>
            <p className="mt-2 text-sm font-medium text-foreground"> Uploading ...</p>
            <p className="mt-1 text-xs text-muted-foreground truncate max-w-xs">
                {file.name}
            </p>
        </div>
    )
}