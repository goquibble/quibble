import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface QuibSkeletonProps {
  className?: string;
  mediaClassName?: string;
}

export default function QuibSkeleton({
  className,
  mediaClassName,
}: QuibSkeletonProps) {
  return (
    <div className={cn("flex flex-col gap-2 rounded-lg border p-4", className)}>
      <div className="flex items-center gap-2">
        <Skeleton className="size-6 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-6 w-100" />
      <Skeleton className={cn("w-full", mediaClassName)} />
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-8 w-8" />
      </div>
    </div>
  );
}
