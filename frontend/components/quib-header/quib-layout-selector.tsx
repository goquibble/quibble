"use client";

import { ChevronDown, Rows2, Rows3 } from "lucide-react";
import { useEffect, useId, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLayoutStore } from "@/stores/layout";
import { Button } from "../ui/button";

export default function QuibLayoutSelector() {
  const { layout, setLayout } = useLayoutStore();
  const [mounted, setMounted] = useState(false);
  const id = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild id={id}>
        <Button size={"sm"} variant={"outline"} className="hidden md:flex">
          {layout === "card" ? (
            <Rows2 className="text-primary" />
          ) : (
            <Rows3 className="text-primary" />
          )}
          <span className="capitalize">{layout}</span>
          <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[var(--radix-dropdown-menu-trigger-width)]"
      >
        <DropdownMenuItem onClick={() => setLayout("card")}>
          <Rows2 />
          Card
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLayout("compact")}>
          <Rows3 />
          Compact
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
