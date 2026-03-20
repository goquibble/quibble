"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getPopularQuiblets } from "@/services/quiblet";
import QuibletJoinBtn from "./quiblet/quiblet-join-btn";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";

export default function PopularQuiblets() {
  const { data: popularQuiblets, isLoading } = useQuery({
    queryKey: ["popular-quiblets"],
    queryFn: getPopularQuiblets,
  });

  return (
    <aside className="flex flex-col gap-4">
      <h4 className="font-medium font-mono text-secondary text-sm uppercase">
        Popular Quiblets
      </h4>
      {isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="size-8 shrink-0 rounded-full" />
              <div className="flex flex-1 flex-col gap-1.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : popularQuiblets?.length === 0 ? (
        <div className="text-muted-foreground text-sm">
          No popular quiblets found.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {popularQuiblets?.map((quiblet) => (
            <div
              key={quiblet.name}
              className="flex items-center justify-between gap-2"
            >
              <Link
                href={`/q/${quiblet.name}`}
                className="group flex min-w-0 flex-1 items-center gap-3 transition-colors hover:text-primary"
              >
                <Avatar className="size-8 shrink-0">
                  <AvatarImage src={quiblet.avatar_url || undefined} />
                  <AvatarFallback seed={quiblet.name} />
                </Avatar>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate font-semibold text-sm group-hover:underline">
                    q/{quiblet.name}
                  </span>
                  <span className="text-secondary text-xs">
                    {quiblet.members_count} members
                  </span>
                </div>
              </Link>
              <QuibletJoinBtn
                name={quiblet.name}
                hasJoined={false}
                size="sm"
                className="h-7 bg-accent! text-accent-foreground text-xs"
              />
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
