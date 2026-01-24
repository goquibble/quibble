"use client";
import { LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthDialog } from "@/hooks/use-auth-dialog";

export default function AuthDialog() {
  const { open, setOpen } = useAuthDialog();

  const handleLogin = () => {
    window.location.href = "http://localhost:5173/log-in";
  };

  const handleSignup = () => {
    window.location.href = "http://localhost:5173/create-account";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Authentication Required</DialogTitle>
          <DialogDescription>
            You need to be logged in to perform this action.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button onClick={handleLogin} className="w-full">
            <LogIn className="mr-2 h-4 w-4" /> Log In
          </Button>
          <Button onClick={handleSignup} variant="outline" className="w-full">
            <UserPlus className="mr-2 h-4 w-4" /> Sign Up
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
