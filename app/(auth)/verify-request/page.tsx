"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function VerifyRequest() {
  // handle otp state
  const [otp, setOtp] = useState("");

  // handle otp transition
  const [isPending, startTransition] = useTransition();

  // get params
  const params = useSearchParams();
  const email = params.get("email");

  // route
  const router = useRouter();

  async function verify() {
    startTransition(async () => {
      await authClient.signIn.emailOtp({
        email: email!,
        otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Verification success");
            router.push("/");
          },
          onError: () => {
            toast.error("Verification failed");
          },
        },
      });
    });
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Please check your email</CardTitle>
        <CardDescription className="text-sm">
          We have sent a verification code to your email address. Please check
          your email and click on the link to verify your email address.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center space-y-2">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
            className="gap-2"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <p className="text-xs text-muted-foreground">
            Enter the six digit code sent to your email
          </p>
        </div>
        <Button
          className="w-full"
          onClick={verify}
          disabled={otp.length !== 6 || isPending}
        >
          Verify
        </Button>
      </CardContent>
    </Card>
  );
}

