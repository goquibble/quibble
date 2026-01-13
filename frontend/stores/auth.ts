import { create } from "zustand";
import type { Nullable } from "@/types/generics";
import type { UserProfile } from "@/types/user";

interface AuthState {
  isAuthenticated: boolean;
  userProfile: Nullable<UserProfile>;
  setUserProfile: (userProfile: Nullable<UserProfile>) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  userProfile: null,
  setUserProfile: (userProfile) =>
    set({ userProfile, isAuthenticated: userProfile !== null }),
}));
