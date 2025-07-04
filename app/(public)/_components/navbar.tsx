"use client";

import Link from "next/link";
import Logo from "@/public/file.svg";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { authClient } from "@/lib/auth-client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Loader2, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import UserDropdown from "./user-dropdown";
interface NavigationItem {
    name: string;
    href: string;
}

const navigationItems: NavigationItem[] = [
    { name: 'home', href: '/' },
    { name: 'courses', href: '/courses' },
    { name: 'about', href: '/about' },
    { name: 'contact', href: '/contact' },
]

export default function Navbar() {
    const { data: session, isPending } = authClient.useSession();

    const router = useRouter();
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60">
            <div className=" container flex  min-h-16 items-center mx-auto px-4 md:px-6 lg:px-8">
                <Link href="/" className="flex items-center space-x-2 mr-4">
                    <Image src={Logo} alt="Logo" width={24} height={24} />
                    <span className="font-bold">Cendekia</span>
                </Link>

                {/* desktop navigation */}
                <nav className="hidden md:flex md:flex-1 md:items-center md:justify-between">
                    <div className="flex items-center space-x-2">
                        {navigationItems.map((item) => (
                            <Link key={item.name} href={item.href} className="text-sm font-medium transition-colors hover:text-primary">
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        {isPending ? null : session ? (
                            <>
                                <UserDropdown
                                    name={session.user.name}
                                    email={session.user.email}
                                    image={session.user.image || ""} />
                            </>

                        ) : (
                            <>
                                <Link href="/login" className={buttonVariants({
                                    variant: "secondary",
                                })}>
                                    Login
                                </Link>
                                <Link href="/register" className={buttonVariants({
                                    variant: "default",
                                })}>
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>


                </nav>
            </div>


        </header>
    );
}