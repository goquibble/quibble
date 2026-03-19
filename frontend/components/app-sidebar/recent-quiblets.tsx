"use client";
import { ChevronUp, History } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useAuthStore } from "@/stores/auth";
import { useRecentStore } from "@/stores/recent";
import QuibletItem from "./quiblet-item";

export default function RecentQuiblets() {
  const { userProfile } = useAuthStore();
  const { getRecentQuiblets, toggleFavoriteQuiblet } = useRecentStore();

  if (!userProfile) return null;

  const recentQuiblets = getRecentQuiblets(userProfile.username);

  return (
    <Collapsible defaultOpen>
      <CollapsibleTrigger className="group flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-1.5 hover:bg-muted">
        <span className="font-mono text-muted-foreground text-sm uppercase">
          Recent
        </span>
        <ChevronUp className="size-4 text-muted-foreground transition-transform group-data-[state=closed]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        {recentQuiblets.length === 0 ? (
          <div className="flex items-center gap-2 p-1.5 text-center text-muted-foreground text-sm">
            <History className="size-6 stroke-1" />
            <span>No recent quiblets found.</span>
          </div>
        ) : (
          recentQuiblets.map((quiblet) => (
            <QuibletItem
              key={quiblet.name}
              {...quiblet}
              onToggle={() =>
                toggleFavoriteQuiblet(userProfile.username, quiblet.name)
              }
            />
          ))
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
