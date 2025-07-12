import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { IconArrowBack } from "@tabler/icons-react"
import { ShieldX } from "lucide-react"
import Link from "next/link"

export default function NotAdmin() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="max-w-lg w-full">
                <CardHeader className="text-center">
                    <div className="bg-destructive/10 rounded-full p-4 w-fit mx-auto">
                        <ShieldX className="size-16 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl"> Access Restricted</CardTitle>
                    <CardDescription className="max-w-xs mx-auto">
                        Hey!, you are not authorized to access this page.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/" className={cn(buttonVariants(
                        {
                            className: "w-full"
                        }
                    ))}>
                        <IconArrowBack />
                        Back to Home</Link>
                </CardContent>

            </Card>
        </div>
    )
}