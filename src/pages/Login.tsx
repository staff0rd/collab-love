import { useState } from "react";

import { signInWithApple } from "../auth/signInWithApple.ts";
import { Button } from "@/components/ui/button.tsx";

const AppleLogo = () => (
  <svg viewBox="0 0 384 512" fill="currentColor" aria-hidden="true">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
);

const Login = () => {
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setError(null);
    try {
      await signInWithApple();
    } catch {
      setError("Sign in failed. Please try again.");
    }
  };

  return (
    <main
      className="flex min-h-dvh flex-col items-center justify-center bg-background px-6"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingLeft: "max(1.5rem, env(safe-area-inset-left))",
        paddingRight: "max(1.5rem, env(safe-area-inset-right))",
        paddingTop: "env(safe-area-inset-top)",
      }}
    >
      <div className="flex w-full max-w-sm flex-col gap-8">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">collab-love</h1>
          <p className="text-muted-foreground">Sign in to see what&apos;s coming up.</p>
        </div>

        <div className="flex flex-col gap-3">
          <Button size="lg" className="w-full" onClick={() => void handleSignIn()}>
            <AppleLogo />
            Sign in with Apple
          </Button>

          {error && (
            <p role="alert" className="text-center text-sm text-destructive">
              {error}
            </p>
          )}
        </div>
      </div>
    </main>
  );
};

export default Login;
