import { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <main className="container mx-auto px-4 md:px-6 lg:px-8">
            {children}
        </main>
    );
}