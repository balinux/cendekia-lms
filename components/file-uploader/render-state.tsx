import { cn } from "@/lib/utils";
import { CloudUploadIcon } from "lucide-react";

interface RenderEmptyStateProps {
    isDragActive: boolean;
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