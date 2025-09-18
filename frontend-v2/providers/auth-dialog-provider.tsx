"use client";
import { useState } from "react";
import AuthDialog from "@/components/dialogs/auth-dialog/auth-dialog";
import { AuthDialogContext } from "@/context/auth-dialog-context";

interface AuthDialogProviderProps {
  children: React.ReactNode;
}

export default function AuthDialogProvider({
  children,
}: AuthDialogProviderProps) {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const showDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);
  const nextStep = () => setCurrentStep((prev) => prev + 1);

  return (
    <AuthDialogContext.Provider
      value={{
        open,
        setOpen,
        showDialog,
        closeDialog,
        currentStep,
        setCurrentStep,
        nextStep,
      }}
    >
      {children}
      <AuthDialog />
    </AuthDialogContext.Provider>
  );
}
