"use client";
import { ChevronRight, Search } from "lucide-react";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import IconInput from "../ui/icon-input";

export default function SearchBar() {
  const [open, setOpen] = useState(false);

  const debouncedOnChange: React.ChangeEventHandler<HTMLInputElement> =
    useDebouncedCallback((e) => {
      const value = e.target.value;
      if (!value.trim()) return;

      setOpen(true);
    }, 500);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <IconInput
          Icon={Search}
          placeholder="Search..."
          wrapperClassName="ml-2"
          className="w-100"
          onChange={debouncedOnChange}
        />
      </PopoverAnchor>
      <PopoverContent className="flex w-[var(--radix-popover-trigger-width)] flex-col gap-2">
        <span className="font-semibold text-muted-foreground text-sm">
          Quiblets
        </span>
        <div className="group flex items-center gap-2">
          <Avatar>
            <AvatarImage src={""} alt="" />
            <AvatarFallback>Q</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm">q/something</span>
            <span className="text-muted-foreground text-sm/none">
              1 member(s)
            </span>
          </div>
          <ChevronRight
            className={cn(
              "ml-auto size-5 text-muted-foreground opacity-0 duration-250",
              "group-hover:slide-in-from-left-25 group-hover:animate-in group-hover:opacity-100",
            )}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
