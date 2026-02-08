"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
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
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, status } = useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: ({ pageParam = 0 }) => getFeed(5, pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.reduce((acc, p) => acc + p.items.length, 0);
      if (loadedCount >= lastPage.count) return undefined;
      return loadedCount;
    },
    enabled: !isLoadingAuth,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (status === "pending" || isLoadingAuth) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pr-2">
        <QuibHeader />
        <div className="flex flex-col gap-4">
          {[...Array(2)].map((_, i) => (
            <QuibSkeleton
              key={String(i)}
              mediaClassName={i === 1 ? "aspect-video" : "h-20"}
            />
          ))}
        </div>
      </div>
    );
  }

  if (status === "error" || !data || data.pages[0].items.length === 0) {
    return <Quibs404 className="mt-4 flex-1" />;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pr-2">
      <QuibHeader />
      {data.pages.map((page, i) => (
        /* biome-ignore lint/suspicious/noArrayIndexKey: Page order is stable */
        <Fragment key={i}>
          {page.items.map((quib) => (
            <QuibCard key={quib.id} layout={layout} {...quib} />
          ))}
        </Fragment>
      ))}

      {hasNextPage && (
        <div ref={ref}>
          <QuibSkeleton mediaClassName="h-20" />
        </div>
      )}
    </div>
  );
}
