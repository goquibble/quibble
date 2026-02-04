"use client";
import { useQuery } from "@tanstack/react-query";
import { Settings } from "lucide-react";
import QuibCard from "@/components/quib-card";
import QuibLayoutSelector from "@/components/quib-header/quib-layout-selector";
import QuibSkeleton from "@/components/quib-skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getUserQuibs } from "@/services/quiblet";
import { useAuthStore } from "@/stores/auth";
import { useLayoutStore } from "@/stores/layout";
import type { UserProfile } from "@/types/user";

interface ProfileViewProps {
  profile: UserProfile;
}

export default function ProfileView({ profile }: ProfileViewProps) {
  const userProfile = useAuthStore((state) => state.userProfile);
  const isLoadingUser = useAuthStore((state) => state.isLoading);
  const layout = useLayoutStore((state) => state.layout);

  const { data: quibs, isLoading: isLoadingQuibs } = useQuery({
    queryKey: ["user", profile.id, "quibs"],
    queryFn: () => getUserQuibs(profile.id),
    enabled: !isLoadingUser,
  });

  return (
    <div className="mx-auto my-4 flex max-w-3xl flex-1 flex-col gap-4 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="size-15">
            <AvatarImage src={profile.avatar ?? ""} />
            <AvatarFallback seed={profile.username ?? ""} />
          </Avatar>
          <div className="flex flex-col">
            <span className="font-bold text-2xl">{profile.username}</span>
            <span className="font-medium text-muted-foreground text-sm">
              u/{profile.username}
            </span>
          </div>
        </div>
        {userProfile?.username === profile.username && (
          <Button variant={"outline"} asChild>
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Settings />
              Settings
            </a>
          </Button>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {[
            { id: "QUIBLS", label: "Quibs", disabled: false },
            { id: "COMMENTS", label: "Comments", disabled: true },
          ].map((type) => {
            const isActive = type.id === "QUIBLS";
            return (
              <button
                key={type.id}
                type="button"
                disabled={type.disabled}
                className={cn(
                  "relative flex w-max justify-center gap-2 rounded-md p-2 px-4 font-semibold transition-colors hover:bg-muted",
                  isActive && "text-primary",
                  type.disabled &&
                    "cursor-not-allowed opacity-50 hover:bg-transparent",
                )}
              >
                <span>{type.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 h-0.5 w-2/3 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
        <QuibLayoutSelector />
      </div>
      <div className="flex flex-col gap-4">
        {isLoadingUser || isLoadingQuibs ? (
          [...Array(2)].map((_, i) => (
            <QuibSkeleton
              key={String(i)}
              mediaClassName={i === 1 ? "aspect-video" : "h-30"}
            />
          ))
        ) : !quibs || !quibs.length ? (
          <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-lg border text-muted-foreground">
            <p>No quibs posted by u/{profile.username} yet.</p>
          </div>
        ) : (
          quibs.map((quib) => (
            <QuibCard key={quib.id} layout={layout} {...quib} />
          ))
        )}
      </div>
    </div>
  );
}
