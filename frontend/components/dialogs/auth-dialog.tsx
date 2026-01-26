"use client";

import {
  CheckCircle2,
  LockKeyhole,
  LogIn,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import { useAuthDialog } from "@/hooks/use-auth-dialog";

export default function AuthDialog() {
  const { open, setOpen } = useAuthDialog();

  const handleLogin = () => {
    window.location.href = `${API_ENDPOINTS.AUTH_APP_URL}/log-in`;
  };

  const handleSignup = () => {
    window.location.href = `${API_ENDPOINTS.AUTH_APP_URL}/create-account`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden sm:max-w-[400px]">
        <div className="flex flex-col items-center text-center">
          <div className="-mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-b from-primary/25 to-primary/10">
            <LockKeyhole className="h-8 w-8 text-primary" />
          </div>

          <DialogHeader>
            <DialogTitle className="text-center font-bold text-2xl tracking-tight">
              Unlock Full Access
            </DialogTitle>
            <DialogDescription className="mx-auto max-w-[75%] text-center text-base">
              Log in to your account to save your progress and manage your
              preferences.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-2 rounded-md bg-muted/50 p-4">
          <div className="flex items-center gap-3 text-muted-foreground text-sm">
            <CheckCircle2 className="size-4 shrink-0 text-primary" />
            <span>Sync your account across all devices</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground text-sm">
            <CheckCircle2 className="size-4 shrink-0 text-primary" />
            <span>Save and organize your favorite quibbles</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground text-sm">
            <Sparkles className="size-4 shrink-0 text-primary" />
            <span>Get personalized recommendations</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleLogin}
            className="h-11 w-full font-medium text-base shadow-md"
          >
            <LogIn className="mr-2 h-4 w-4" /> Log In
          </Button>
          <Button
            onClick={handleSignup}
            variant="outline"
            className="h-11 w-full border-muted-foreground/20 font-medium text-base hover:bg-muted/80"
          >
            <UserPlus className="mr-2 h-4 w-4" /> Create Account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
