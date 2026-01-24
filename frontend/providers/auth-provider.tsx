"use client";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getUserProfile } from "@/services/user";
import { refreshToken } from "@/services/auth";
import { useAuthStore } from "@/stores/auth";
import type { UserProfile } from "@/types/user";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const setUserProfile = useAuthStore((state) => state.setUserProfile);
  const { data: userProfile, refetch: fetchUserProfile } =
    useQuery<UserProfile>({
      queryKey: ["user-profile"],
      queryFn: () => getUserProfile(),
      enabled: false, // Don't fetch automatically until token is ready
    });

  useEffect(() => {
    const initAuth = async () => {
      // 1. Refresh Token
      const token = await refreshToken();
      if (token) {
        // 2. Fetch User Profile (API call -> Backend -> Auth Service)
        const profile = await fetchUserProfile();
        if (profile.data) {
          setUserProfile(profile.data);
        }
      }
    };
    initAuth();
  }, [setUserProfile, fetchUserProfile]);

  return <>{children}</>;
}
