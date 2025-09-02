"use client";

import { createContext, useContext, useState } from "react";
import AuthDialog from "@/components/auth-dialog/auth-dialog";

interface AuthDialogContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showDialog: () => void;
  closeDialog: () => void;
}

interface AuthDialogProviderProps {
  children: React.ReactNode;
}

const AuthDialogContext = createContext<AuthDialogContextType | undefined>(
  undefined,
);

export function AuthDialogProvider({ children }: AuthDialogProviderProps) {
  const [open, setOpen] = useState(false);

  const showDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  return (
    <AuthDialogContext.Provider
      value={{ open, setOpen, showDialog, closeDialog }}
    >
      {children}
      <AuthDialog />
    </AuthDialogContext.Provider>
  );
}

export function useAuthDialog(): AuthDialogContextType {
  const context = useContext(AuthDialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }

  return context;
}
