import { ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { recentQuiblets } from "./_data";
import QuibletItem from "./quiblet-item";

export default function RecentQuiblets() {
  return (
    <Collapsible defaultOpen>
      <CollapsibleTrigger className="group flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-1.5 hover:bg-muted">
        <span className="text-muted-foreground">Recent</span>
        <ChevronUp className="size-4 text-muted-foreground transition-transform group-data-[state=closed]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        {recentQuiblets.map((quiblet) => (
          <QuibletItem key={quiblet.name} {...quiblet} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
