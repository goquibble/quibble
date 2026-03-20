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
          <div className="relative mb-2 rounded-full border border-primary/20 bg-primary/10 p-3">
            <LockKeyhole className="size-7 text-primary shadow-sm" />
          </div>

          <DialogHeader>
            <DialogTitle className="text-center font-bold text-2xl tracking-tight">
              Authentication Required
            </DialogTitle>
            <DialogDescription className="mx-auto text-center text-base">
              This actions needs you to be logged in to your account. Your
              progress will be saved.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div hidden className="space-y-2 rounded-md bg-muted/50 p-4">
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
