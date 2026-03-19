import {
  BookOpenText,
  Building,
  ChevronUp,
  Code,
  HelpCircle,
  Webhook,
} from "lucide-react";
import { Fragment } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Icons } from "../icons";

const resources = [
  {
    href: "https://github.com/goquibble/quibble",
    icon: Icons.quibbleIcon,
    label: "About Quibble",
  },
  {
    href: "https://github.com/goquibble",
    icon: Building,
    label: "Organization",
  },
  {
    href: "https://github.com/goquibble/quibble/discussions",
    icon: HelpCircle,
    label: "Help",
  },
  {
    href: "https://github.com/goquibble",
    icon: Code,
    label: "Source",
  },
  {
    href: "https://avatars.goquibble.online",
    icon: Webhook,
    label: "Avatars Playground",
  },
  {
    href: "https://accounts.goquibble.online",
    icon: Webhook,
    label: "Accounts",
  },
  {
    href: "#",
    icon: BookOpenText,
    label: "Quibble Rules",
  },
  {
    href: "#",
    icon: BookOpenText,
    label: "Privacy Policy",
  },
  {
    href: "#",
    icon: BookOpenText,
    label: "User Agreement",
  },
];

export default function Resources() {
  return (
    <Collapsible defaultOpen>
      <CollapsibleTrigger className="group flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-1.5 hover:bg-muted">
        <span className="font-mono text-muted-foreground text-sm uppercase">
          Resources
        </span>
        <ChevronUp className="size-4 text-muted-foreground transition-transform group-data-[state=closed]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        {resources.map((item, idx) => (
          <Fragment key={item.href + String(idx)}>
            {(idx === 4 || idx === 6) && <div className="mt-2 border-t pt-2" />}
            <a
              href={item.href}
              target="_blank"
              className="flex items-center gap-2 rounded-md p-1.5 hover:bg-muted"
            >
              <div className="grid size-6 place-items-center">
                <item.icon className="size-4 text-muted-foreground" />
              </div>
              <span className="font-medium text-sm">{item.label}</span>
            </a>
          </Fragment>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
