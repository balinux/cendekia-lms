"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { Book } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Feature {
    title: string;
    description: string;
    icon: React.ReactNode;
}

const features: Feature[] = [
    {
        title: "Interactive Learning",
        description: "Engage with interactive content, quizzes, and exercises to enhance your learning experience.",
        icon: <Book/>
    },
    {
        title: "Personalized Learning",
        description: "Tailored learning paths based on your interests and goals to help you achieve your learning objectives.",
        icon: <Book/>
    },
    {
        title: "Progress Tracking",
        description: "Track your progress, set goals, and receive personalized feedback to help you stay motivated.",
        icon: <Book/>
    },
    {
        title: "Community Building",
        description: "Connect with like-minded learners, share knowledge, and build a community of learners.",
        icon: <Book/>
    },
    {
        title: "Accessibility",
        description: "Our platform is accessible to all users, with features such as closed captions, transcripts, and screen reader support.",
        icon: <Book/>
    },
    {
        title: "Mobile Learning",
        description: "Access your courses on the go with our mobile app, available for iOS and Android.",
        icon: <Book/>
    },
];
   

export default function Home() {
  const router = useRouter();
  const { data: session } = authClient.useSession() ;

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
  <>
  <section  className="relative py-20">
    <div className="flex flex-col items-center text-center space-y-8">
      <Badge variant='outline'> The future of online education is here</Badge>
      <h1 className="text-4xl font-bold tracking-tight md:text-6xl">Elevate your learning experience</h1>
      <p className="max-w-[600px] text-muted-foreground md:text-xl">Discover a new way to learn with our modern, interactive, and personalized learning platform</p>
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Link className={buttonVariants({
            size: "lg",
        })} href="/courses">Explore Courses</Link>

        <Link className={buttonVariants({
            size: "lg",
            variant: "outline",
        })} href="/login">Sign In</Link>
      </div>
    </div>
  </section>

{/* section for features */}
  <section>
    <div className="container"> 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {feature.icon}
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  </section>
  </>

  );
}
