import { create } from "zustand";
import type { Nullable } from "@/types/generics";
import type { UserProfile } from "@/types/user";

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  userProfile: Nullable<UserProfile>;
  setUserProfile: (userProfile: Nullable<UserProfile>) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  isLoading: true,
  isAuthenticated: false,
  userProfile: null,
  setUserProfile: (userProfile) =>
    set({ userProfile, isAuthenticated: userProfile !== null }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
