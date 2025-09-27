"use client";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { search } from "@/services/search";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import IconInput from "../ui/icon-input";

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const debouncedOnChange: React.ChangeEventHandler<HTMLInputElement> =
    useDebouncedCallback((e) => {
      const value = e.target.value.trim();
      setQuery(value);
      setOpen(true);
    }, 500);

  const { data } = useQuery({
    queryKey: ["search", query],
    queryFn: () => search(query),
    enabled: !!query,
  });

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
        {data?.quiblets.map((quiblet) => (
          <Link
            key={quiblet.id}
            href={`/q/${quiblet.name}`}
            className="group flex items-center gap-2"
          >
            <Avatar>
              <AvatarImage src={quiblet.avatar ?? ""} alt={quiblet.name} />
              <AvatarFallback>Q</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm">q/{quiblet.name}</span>
              <span className="text-muted-foreground text-sm/none">
                {quiblet.members_count} member(s)
              </span>
            </div>
            <ChevronRight
              className={cn(
                "ml-auto size-5 text-muted-foreground opacity-0 duration-250",
                "group-hover:slide-in-from-left-25 group-hover:animate-in group-hover:opacity-100",
              )}
            />
          </Link>
        ))}
      </PopoverContent>
    </Popover>
  );
}
