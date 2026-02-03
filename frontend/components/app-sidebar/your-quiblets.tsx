"use client";
import { useQuery } from "@tanstack/react-query";
import { ChevronUp, CircleSlash, Settings } from "lucide-react";
import Link from "next/link";
import { getUserQuiblets } from "@/services/quiblet";
import { useAuthStore } from "@/stores/auth";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Skeleton } from "../ui/skeleton";
import QuibletItem from "./quiblet-item";

export default function YourQuiblets() {
  const userProfile = useAuthStore((state) => state.userProfile);

  const { data: quiblets, isLoading } = useQuery({
    queryKey: ["user-quiblets", userProfile?.id],
    queryFn: getUserQuiblets,
    enabled: !!userProfile,
  });

  if (!userProfile) return null;

  return (
    <Collapsible defaultOpen>
      <CollapsibleTrigger className="group flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-1.5 hover:bg-muted">
        <span className="text-muted-foreground">Your Quiblets</span>
        <ChevronUp className="size-4 text-muted-foreground transition-transform group-data-[state=closed]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        {quiblets && quiblets.length > 0 && (
          <Link
            href={`/u/${userProfile.username}/quiblets`}
            className="pointer-events-none flex select-none items-center gap-2 rounded-md p-1.5 opacity-50 hover:bg-muted"
            aria-disabled={true}
          >
            <div className="grid size-6 place-items-center">
              <Settings className="size-4 text-muted-foreground" />
            </div>
            <span className="font-medium text-sm">Manage Quiblets</span>
          </Link>
        )}
        {isLoading ? (
          <div className="flex flex-col gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
              <div key={i} className="flex items-center gap-2 px-1.5 py-1.5">
                <Skeleton className="size-6 rounded-full" />
                <Skeleton className="h-6 w-40" />
              </div>
            ))}
          </div>
        ) : quiblets?.length === 0 ? (
          <div className="flex items-center gap-2 p-1.5 text-center text-muted-foreground text-sm">
            <CircleSlash className="size-6 stroke-1" />
            <span>No quiblets joined yet.</span>
          </div>
        ) : (
          quiblets?.map((quiblet) => (
            <QuibletItem
              key={quiblet.name}
              name={quiblet.name}
              avatar={quiblet.avatar || ""}
              isStarred={false}
              onToggle={() => {}}
            />
          ))
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
