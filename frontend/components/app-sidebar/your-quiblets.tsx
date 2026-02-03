"use client";
import { ChevronUp, Settings } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { recentQuiblets } from "./_data";
import QuibletItem from "./quiblet-item";

export default function YourQuiblets() {
  const userProfile = useAuthStore((state) => state.userProfile);

  return (
    <Collapsible defaultOpen>
      <CollapsibleTrigger className="group flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-1.5 hover:bg-muted">
        <span className="text-muted-foreground">Your Quiblets</span>
        <ChevronUp className="size-4 text-muted-foreground transition-transform group-data-[state=closed]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        {userProfile && (
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
        {recentQuiblets.map((quiblet) => (
          <QuibletItem key={quiblet.name} {...quiblet} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
