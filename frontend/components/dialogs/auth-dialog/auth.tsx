import { useState } from "react";
import AuthForm from "@/components/forms/auth-form";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <>
      <div className="flex flex-col gap-2">
        <span className="font-medium text-sm">Continue with Open account</span>
        <div className="grid grid-cols-2 gap-2.5">
          <Button variant={"outline"}>
            <Icons.google className="fill-primary" />
            Google
          </Button>
          <Button variant={"outline"} disabled>
            <Icons.github className="fill-primary" />
            GitHub
          </Button>
        </div>
      </div>
      <Separator />
      <div className="flex flex-col gap-2">
        <span className="font-medium text-sm">
          Or continue with email address
        </span>
        <AuthForm mode={mode} />
        <span className="inline-flex gap-1 self-center font-medium text-muted-foreground text-sm">
          {mode === "login" ? (
            <>
              Don't have an account?
              <button
                type="button"
                className="underline"
                onClick={() => setMode("signup")}
              >
                Signup!
              </button>
            </>
          ) : (
            <>
              Already have an account?
              <button
                type="button"
                className="underline"
                onClick={() => setMode("login")}
              >
                Login!
              </button>
            </>
          )}
        </span>
      </div>
    </>
  );
}
