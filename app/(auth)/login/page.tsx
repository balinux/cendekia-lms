"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { GithubIcon, Loader } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

export default function LoginPage() {

    const [isGithubPending, startGithubTransition] = useTransition()

    async function signInWithGithub() {
        startGithubTransition(async () => {
            await authClient.signIn.social({
                provider: 'github',
                callbackURL: '/',
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Login success")
                    },
                    onError: () => {
                        toast.error("Login failed")
                    }
                }
            })
        })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Welcome back!</CardTitle>
                <CardDescription>Login with GitHub email account</CardDescription>
            </CardHeader>
            <CardContent className=" flex flex-col gap-4">
                <Button className="w-full" variant="outline" onClick={signInWithGithub} disabled={isGithubPending}> 
                    {isGithubPending?(
                        <>
                        <Loader className="mr-2 size-4 animate-spin" />
                        <span>Loading...</span>
                        </>
                    ):(
                        <>
                        <GithubIcon className="size-4" /> Continue with GitHub
                        </>
                    )}
                </Button>

                {/* divider */}
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:itmes-center after:border-t after:border-border">
                    <span className="relative z-10 bg-card px-2 text-muted-foreground   ">or continue with</span>
                </div>

                {/* form input */}
                <div className="grid gap-3">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="name@example.com" />
                    </div>
                    <Button className="w-full">Continue with email</Button>
                </div>
            </CardContent>
        </Card>
    )
}