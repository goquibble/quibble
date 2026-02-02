"use client";
import { useQuery } from "@tanstack/react-query";
import { getFeed } from "@/services/feed";
import { useAuthStore } from "@/stores/auth";
import { useLayoutStore } from "@/stores/layout";
import QuibCard from "./quib-card";
import QuibHeader from "./quib-header";
import QuibSkeleton from "./quib-skeleton";
import Quibs404 from "./quibs-404";

export default function Feed() {
  const isLoadingAuth = useAuthStore((state) => state.isLoading);
  const layout = useLayoutStore((state) => state.layout);
  const { data, isLoading } = useQuery({
    queryKey: ["feed"],
    queryFn: () => getFeed(),
    enabled: !isLoadingAuth,
  });

  if (isLoading || isLoadingAuth) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pr-2">
        <QuibHeader />
        <div className="flex flex-col gap-4">
          {[...Array(2)].map((_, i) => (
            <QuibSkeleton
              key={String(i)}
              mediaClassName={i === 1 ? "aspect-video" : "h-30"}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return <Quibs404 className="mt-4 flex-1" />;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pr-2">
      <QuibHeader />
      {data.items.map((quib) => (
        <QuibCard key={quib.id} layout={layout} {...quib} />
      ))}
    </div>
  );
}
