"use client";

import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { RenderEmptyState, RenderErrorState, RenderUploadedState, RenderUploadingState } from "./render-state";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface UploaderState {
    id: string | null;
    file: File | null;
    uploading: boolean;
    progress: number;
    key?: string;
    isDeleting: boolean;
    error: boolean;
    objectURL?: string;
    fileType?: "image" | "video";
}

export default function Uploader() {

    const [fileState, setFileState] = useState<UploaderState>({
        id: null,
        file: null,
        uploading: false,
        progress: 0,
        isDeleting: false,
        error: false,
        fileType: "image"
    })

    async function uploadFile(file: File) {
        setFileState((prev) => ({
            ...prev,
            uploading: true,
            progress: 0,
        }));

        try {
            // get presigned url
            const response = await fetch("/api/s3/upload", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fileName: file.name,
                    fileType: file.type,
                    size: file.size,
                    isImage: file.type.startsWith("image/"),
                }),
            })
            // check response
            if (!response.ok) {
                toast.error("Failed to get presigned URL")
                setFileState((prev) => ({
                    ...prev,
                    uploading: false,
                    progress: 0,
                    error: true,
                }));

                return;
            }

            const { presignedUrl, fileKey } = await response.json();

            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest();

                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const progress = (event.loaded / event.total) * 100;
                        setFileState((prev) => ({
                            ...prev,
                            progress: Math.round(progress),
                        }));
                    }
                }

                xhr.onload = () => {
                    if (xhr.status === 200 || xhr.status === 204) {
                        setFileState((prev) => ({
                            ...prev,
                            uploading: false,
                            progress: 100,
                            key: fileKey,
                        }));
                        toast.success("File uploaded successfully");
                        resolve();
                    } else {
                        reject();
                    }
                }

                // on error
                xhr.onerror = () => {
                    toast.error("Failed to upload file")
                    setFileState((prev) => ({
                        ...prev,
                        uploading: false,
                        progress: 0,
                        error: true,
                    }));
                    reject();
                }

                xhr.open("PUT", presignedUrl);
                xhr.setRequestHeader("Content-Type", file.type);
                xhr.send(file);
            })
        } catch (error) {
            toast.error("Failed to upload file")
            setFileState((prev) => ({
                ...prev,
                uploading: false,
                progress: 0,
                error: true,
            }));
        }
    }


    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Do something with the files
        // console.log(acceptedFiles)
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0]
            setFileState({
                id: uuidv4(),
                file: file,
                uploading: false,
                progress: 0,
                objectURL: URL.createObjectURL(file),
                isDeleting: false,
                error: false,
                fileType: "image"
            })

            uploadFile(file)
        }
    }, [])

    function rejectedFile(files: FileRejection[]) {
        if (files.length > 0) {
            const tooManyFiles = files.filter(file => file.errors[0].code === "too-many-files")
            if (tooManyFiles.length > 0) {
                toast.error("Too many files, please select only one file")
            }
            const tooLargeFiles = files.filter(file => file.errors[0].code === "file-too-large")
            if (tooLargeFiles.length > 0) {
                toast.error("File too large, please select a file smaller than 5MB")
            }
        }
    }

    // render state
    const renderState = () => {
        if (fileState.error) {
            return <RenderErrorState isDragActive={false} />
        }
        if (fileState.uploading) {
            return <RenderUploadingState progress={fileState.progress} file={fileState.file as File} />;
        }

        if (fileState.objectURL) {
            return <RenderUploadedState previewUrl={fileState.objectURL} />;
        }
        return <RenderEmptyState isDragActive={isDragActive} />
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".png", ".jpg", ".jpeg"],
        },
        maxFiles: 1,
        multiple: false,
        maxSize: 1024 * 1024 * 5,
        onDropRejected: rejectedFile
    })
    return (
        <Card {...getRootProps()} className={cn(
            "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64 cursor-pointer",
            isDragActive
                ? "border-primary bg-primary/10 border-solid"
                : "border-border hover:border-primary"
        )}>
            <CardContent className="flex items-center justify-center h-full w-full p-4">
                <input {...getInputProps()} />
                {/* {
                isDragActive ?
                    <p>Drop the files here ...</p> :
                    <p>Drag 'n' drop some files here, or click to select files</p>
            } */}
                {renderState()}
            </CardContent>
        </Card>
    )
}