import { ThemeToggle } from "@/components/theme-toggle";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (!session) {
    return <div>Not authenticated go to <Link href="/login">login</Link></div>
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      {
        session ? (
          <>
            <h1>Hello {session.user.name}</h1>
            <ThemeToggle />
          </>
        ) : (
          <div>Not authenticated go to <Link href="/login">login</Link></div>
        )
      }
    </div>

  );
}
