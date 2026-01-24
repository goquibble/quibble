"use client";
import { useState } from "react";
import AuthDialog from "@/components/dialogs/auth-dialog";
import { AuthDialogContext } from "@/context/auth-dialog-context";

interface AuthDialogProviderProps {
  children: React.ReactNode;
}

export default function AuthDialogProvider({
  children,
}: AuthDialogProviderProps) {
  const [open, setOpen] = useState(false);

  const showDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  return (
    <AuthDialogContext.Provider
      value={{
        open,
        setOpen,
        showDialog,
        closeDialog,
      }}
    >
      {children}
      <AuthDialog />
    </AuthDialogContext.Provider>
  );
}
