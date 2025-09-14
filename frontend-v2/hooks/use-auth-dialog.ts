import { useContext } from "react";
import {
  AuthDialogContext,
  type AuthDialogContextType,
} from "@/context/auth-dialog-context";

export function useAuthDialog(): AuthDialogContextType {
  const context = useContext(AuthDialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }

  return context;
}
