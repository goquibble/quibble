"use client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
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
          {[...Array(5)].map((_, i) => (
            <div
              key={String(i)}
              className="flex flex-col space-y-3 rounded-xl border p-4"
            >
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
              <Skeleton className="h-[100px] w-full rounded-xl" />
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
