"use client";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { refreshToken } from "@/services/auth";
import { getUserProfile } from "@/services/user";
import { useAuthStore } from "@/stores/auth";
import type { UserProfile } from "@/types/user";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const setUserProfile = useAuthStore((state) => state.setUserProfile);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);

  const { refetch: fetchUserProfile } = useQuery<UserProfile>({
    queryKey: ["user-profile"],
    queryFn: () => getUserProfile(),
    enabled: false, // Don't fetch automatically until token is ready
  });

  useEffect(() => {
    const initAuth = async () => {
      try {
        // 1. Refresh Token
        const token = await refreshToken();
        if (token) {
          // 2. Fetch User Profile (API call -> Backend -> Auth Service)
          const profile = await fetchUserProfile();
          if (profile.data) {
            setUserProfile(profile.data);
          }
        }
      } catch (error) {
        console.error("Auth init failed", error);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, [setUserProfile, fetchUserProfile, setIsLoading]);

  return <>{children}</>;
}
