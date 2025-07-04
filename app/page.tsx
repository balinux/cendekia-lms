"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();
  const { data: session } = authClient.useSession() ;

  if (!session) {
    return <div>Not authenticated go to <Link href="/login">login</Link></div>
  }

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login"); // redirect to login page
          toast.success("Logout success")
        },
      },
    });
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      {
        session ? (
          <>
            <h1>Hello {session.user.name}</h1>
            <ThemeToggle />
            <Button onClick={signOut}>Sign out</Button>
          </>
        ) : (
          <div>Not authenticated go to <Link href="/login">login</Link></div>
        )
      }
    </div>

  );
}
