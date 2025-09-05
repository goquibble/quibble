"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthDialog } from "@/context/auth-dialog-context";
import ProfileConfirmForm from "../forms/profile-confirm-form";
import VerificationForm from "../forms/verification-form";
import { Icons } from "../icons";
import Auth from "./auth";

const forms = [Auth, VerificationForm, ProfileConfirmForm];

export default function AuthDialog() {
  const { open, setOpen, currentStep } = useAuthDialog();
  const Form = forms[currentStep];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>Authentication Dialog</DialogTitle>
          </DialogHeader>
        </VisuallyHidden>
        <div className="mx-auto flex w-full max-w-xs flex-col gap-4">
          <Icons.quibbles className="mx-auto h-max w-1/3" />
          <h5 className="text-center font-bold text-2xl dark:text-white/90">
            Welcome to <br /> Quibble
          </h5>
          <Form />
        </div>
      </DialogContent>
    </Dialog>
  );
}
