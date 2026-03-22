"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useLayoutStore } from "@/stores/layout";

interface QuibSkeletonProps {
  className?: string;
  mediaClassName?: string;
}

export default function QuibSkeleton({
  className,
  mediaClassName,
}: QuibSkeletonProps) {
  const layout = useLayoutStore((state) => state.layout);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (layout === "compact") {
    return (
      <div
        className={cn(
          "flex items-start gap-4 rounded-lg border p-3",
          className,
        )}
      >
        <Skeleton className="size-24 shrink-0 rounded-lg" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="size-6 rounded-full" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-5 w-2/3" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2 rounded-lg border p-4", className)}>
      <div className="flex items-center gap-2">
        <Skeleton className="size-6 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-6 w-full md:w-100" />
      <Skeleton className={cn("w-full", mediaClassName)} />
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-14 md:w-36" />
        <Skeleton className="h-8 w-8" />
      </div>
    </div>
  );
}
