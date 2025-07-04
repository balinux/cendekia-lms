import Link from "next/link";
import Logo from "@/public/file.svg";
import Image from "next/image";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60">
            <div className="container flex items-center justify-between py-4">
                <div className=" container flex  min-h-16 items-center mx-auto px-4 md:px-6 lg:px-8">
                    <Link href="/" className="flex items-center space-x-2 mr-4">
                        <Image src={Logo} alt="Logo" width={24} height={24} />
                        <span className="font-bold">Cendekia</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}