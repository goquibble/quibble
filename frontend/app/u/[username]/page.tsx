"use client";
import { useQuery } from "@tanstack/react-query";
import { Settings } from "lucide-react";
import { useParams } from "next/navigation";
import QuibCard from "@/components/quib-card";
import QuibLayoutSelector from "@/components/quib-header/quib-layout-selector";
import QuibSkeleton from "@/components/quib-skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getUserQuibs } from "@/services/quiblet";
import { useAuthStore } from "@/stores/auth";
import { useLayoutStore } from "@/stores/layout";

export default function UserPage() {
  const { username } = useParams<{ username: string }>();
  const userProfile = useAuthStore((state) => state.userProfile);
  const isLoading = useAuthStore((state) => state.isLoading);
  const layout = useLayoutStore((state) => state.layout);

  const { data: quibs, isLoading: isLoadingQuibs } = useQuery({
    queryKey: ["user", userProfile?.id, "quibs"],
    queryFn: () => getUserQuibs(userProfile?.id ?? ""),
    enabled: !!userProfile?.id,
  });

  return (
    <div className="mx-auto my-4 flex max-w-3xl flex-1 flex-col gap-4 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isLoading ? (
            <>
              <Skeleton className="size-15 rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-6 w-30" />
                <Skeleton className="h-3 w-20" />
              </div>
            </>
          ) : (
            <>
              <Avatar className="size-15">
                <AvatarImage src={userProfile?.avatar ?? ""} />
                <AvatarFallback seed={userProfile?.username ?? ""} />
              </Avatar>
              <div className="flex flex-col">
                <span className="font-bold text-2xl">
                  {userProfile?.username}
                </span>
                <span className="font-medium text-muted-foreground text-sm">
                  u/{userProfile?.username}
                </span>
              </div>
            </>
          )}
        </div>
        {userProfile?.username === username && (
          <Button variant={"outline"}>
            <Settings />
            Settings
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
        {isLoading || isLoadingQuibs ? (
          [...Array(2)].map((_, i) => (
            <QuibSkeleton
              key={String(i)}
              mediaClassName={i === 1 ? "aspect-video" : "h-30"}
            />
          ))
        ) : !quibs || !quibs.length ? (
          <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-lg border text-muted-foreground">
            <p>No quibs posted by u/{username} yet.</p>
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
