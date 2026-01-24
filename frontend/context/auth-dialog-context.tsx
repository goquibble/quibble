"use client";
import { createContext } from "react";

interface AuthDialogContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  showDialog: () => void;
  closeDialog: () => void;
}

export const AuthDialogContext = createContext<AuthDialogContextType | null>(
  null,
);
