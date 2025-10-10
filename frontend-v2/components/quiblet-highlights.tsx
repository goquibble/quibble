import { ChevronUp, Pin } from "lucide-react";
import Image from "next/image";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function QuibletHighlights() {
  return (
    <Collapsible className="mt-4" defaultOpen>
      <CollapsibleTrigger className="group flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-1.5 hover:bg-muted">
        <Pin className="size-4" />
        <span className="mr-auto font-medium text-sm">Highlights</span>
        <ChevronUp className="size-4 text-muted-foreground transition-transform group-data-[state=closed]:rotate-180" />
      </CollapsibleTrigger>

      <CollapsibleContent className="scrollbar-hide mt-2 flex snap-x gap-3 overflow-x-auto">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx.toString()}
            className="flex w-75 flex-shrink-0 snap-start gap-2 rounded border p-2 hover:bg-input/30"
          >
            <Image
              src="http://localhost:9000/quibble-media-dev-ap-south-1/covers/q-vcacj57-small.webp"
              alt="cover"
              width={75}
              height={75}
              className="rounded-sm"
            />
            <div className="flex flex-col">
              <span className="line-clamp-2 font-bold">
                Which design is your favorite? Let me know below!
              </span>
              <span className="text-muted-foreground text-xs">
                34 upvotes — 12 comments
              </span>
            </div>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
