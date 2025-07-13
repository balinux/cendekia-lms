import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import file from "@/public/file.svg";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center">
            <Link href="/" className={buttonVariants(
                {
                    variant: "outline",
                    className: "absolute top-4 left-4"
                }
            )}>
                <ArrowLeft className="size-4" />
                Back
            </Link>
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link href="/" className="flex items-center gap-2 self-center font-medium">
                    <Image src={file} alt="Logo" width={24} height={24} />
                    Cendekia
                </Link>
                {children}
                <div className="text-balance text-xs text-center text-muted-foreground">
                    By clicking continue, you agree to our <span className="hover:text-primary hover:underline cursor-pointer">Terms of Service</span> and <span className="hover:text-primary hover:underline cursor-pointer">Privacy Policy</span>
                </div>
            </div>
        </div>
    )
}
