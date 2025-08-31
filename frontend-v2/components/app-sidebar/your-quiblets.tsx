import { ChevronUp, Settings } from "lucide-react";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { recentQuiblets } from "./_data";
import QuibletItem from "./quiblet-item";

export default function YourQuiblets() {
  return (
    <Collapsible defaultOpen>
      <CollapsibleTrigger className="group flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-1.5 hover:bg-muted">
        <span className="text-muted-foreground">Your Quiblets</span>
        <ChevronUp className="size-4 text-muted-foreground transition-transform group-data-[state=closed]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="slide-in-from-top-5 fade-in animate-in">
        <Link
          href={"/u/stabldev/quiblets"}
          className="flex items-center gap-2 rounded-md p-1.5 hover:bg-muted"
        >
          <div className="grid size-6 place-items-center">
            <Settings className="size-4 text-muted-foreground" />
          </div>
          <span className="font-medium text-sm">Manage Quiblets</span>
        </Link>
        {recentQuiblets.map((quiblet) => (
          <QuibletItem key={quiblet.name} {...quiblet} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
