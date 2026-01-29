"use client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getFeed } from "@/services/feed";
import { useAuthStore } from "@/stores/auth";
import QuibCard from "./quib-card";
import QuibHeader from "./quib-header";
import Quibs404 from "./quibs-404";

export default function Feed() {
  const isLoadingAuth = useAuthStore((state) => state.isLoading);
  const { data, isLoading } = useQuery({
    queryKey: ["feed"],
    queryFn: () => getFeed(),
    enabled: !isLoadingAuth,
  });

  if (isLoading || isLoadingAuth) {
    return (
      <div className="flex flex-1 flex-col p-4 pr-2">
        <QuibHeader />
        <div className="flex flex-col gap-4">
          {[...Array(2)].map((_, i) => (
            <div
              key={String(i)}
              className="flex flex-col gap-2 rounded-lg border p-4"
            >
              <div className="flex items-center gap-2">
                <Skeleton className="size-6 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-100" />
              <Skeleton
                className={cn("w-full", i === 1 ? "aspect-video" : "h-30")}
              />
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-36" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return <Quibs404 className="mt-4 flex-1" />;
  }

  return (
    <div className="flex flex-1 flex-col p-4 pr-2">
      <QuibHeader />
      {data.items.map((quib) => (
        <QuibCard key={quib.id} {...quib} />
      ))}
    </div>
  );
}
