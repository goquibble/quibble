"use client";
import { createContext } from "react";

export interface AuthDialogContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  showDialog: () => void;
  closeDialog: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
}

export const AuthDialogContext = createContext<
  AuthDialogContextType | undefined
>(undefined);
