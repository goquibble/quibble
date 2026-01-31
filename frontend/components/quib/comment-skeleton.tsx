import { Skeleton } from "../ui/skeleton";

export default function CommentSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={String(i)} className="flex gap-2">
          <Skeleton className="size-7 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-15 w-75" />

            {i === 0 && (
              <div className="mt-2 flex gap-2">
                <Skeleton className="size-7 rounded-full" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-100" />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
