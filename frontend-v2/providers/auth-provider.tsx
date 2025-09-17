"use client";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getUserProfile } from "@/services/user";
import { useAuthStore } from "@/stores/auth";
import type { UserProfile } from "@/types/user";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const setUserProfile = useAuthStore((state) => state.setUserProfile);
  const { data: userProfile } = useQuery<UserProfile>({
    queryKey: ["user-profile"],
    queryFn: () => getUserProfile(),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (userProfile) setUserProfile(userProfile);
  }, [userProfile, setUserProfile]);

  return <>{children}</>;
}
