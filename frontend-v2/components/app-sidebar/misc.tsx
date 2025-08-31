import { ChevronUp, HelpCircle } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Icons } from "../icons";

const misc = [
  {
    href: "https://github.com/quibble-dev/quibble",
    icon: Icons.icon,
    label: "About Quibble",
  },
  {
    href: "https://github.com/quibble-dev/quibble/discussions",
    icon: HelpCircle,
    label: "Help",
  },
];

export default function Misc() {
  return (
    <Collapsible defaultOpen>
      <CollapsibleTrigger className="group flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-1.5 hover:bg-muted">
        <span className="text-muted-foreground">Misc</span>
        <ChevronUp className="size-4 text-muted-foreground transition-transform group-data-[state=closed]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="slide-in-from-top-5 fade-in animate-in">
        {misc.map((item) => (
          <a
            key={item.href}
            href={item.href}
            target="_blank"
            className="flex items-center gap-2 rounded-md p-1.5 hover:bg-muted"
          >
            <div className="grid size-6 place-items-center">
              <item.icon className="size-4 text-muted-foreground" />
            </div>
            <span className="font-medium text-sm">{item.label}</span>
          </a>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
