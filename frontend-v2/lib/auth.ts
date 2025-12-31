import type { Nullable } from "@/types/generics";

export function getAuthHeaders({ csrfToken }: { csrfToken: Nullable<string> }) {
  return {
    "Content-Type": "application/json",
    "X-Csrftoken": csrfToken ?? "",
  };
}
