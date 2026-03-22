"use client";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { search } from "@/services/search";
import IconInput from "../ui/icon-input";
import SearchItem from "./search-item";

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const debouncedOnChange: React.ChangeEventHandler<HTMLInputElement> =
    useDebouncedCallback((e) => {
      const value = e.target.value.trim();
      setQuery(value);
    }, 500);

  const { data } = useQuery({
    queryKey: ["search", query],
    queryFn: () => search(query),
    enabled: !!query,
  });

  useEffect(() => {
    if (!data) return;
    const hasResults = Object.values(data).some((item) => item.length > 0);
    setOpen(hasResults);
  }, [data]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <IconInput
          Icon={Search}
          placeholder="Search..."
          wrapperClassName="ml-2 hidden md:flex"
          className="w-100"
          onChange={debouncedOnChange}
        />
      </PopoverAnchor>
      <PopoverContent className="flex w-[var(--radix-popover-trigger-width)] flex-col gap-2">
        <span
          hidden={data?.quiblets.length === 0}
          className="font-semibold text-muted-foreground text-sm"
        >
          Quiblets
        </span>
        {data?.quiblets.map((quiblet) => (
          <SearchItem
            key={quiblet.id}
            href={`/q/${quiblet.name}`}
            avatar_url={quiblet.avatar_url}
            mainText={`q/${quiblet.name}`}
            subText={`${quiblet.members_count} member(s)`}
          />
        ))}
        <span
          hidden={data?.profiles.length === 0}
          className={cn(
            "font-semibold text-muted-foreground text-sm",
            data?.quiblets.length && "mt-2",
          )}
        >
          Profiles
        </span>
        {data?.profiles.map((profile) => (
          <SearchItem
            key={profile.id}
            href={`/u/${profile.username}`}
            avatar_url={profile.avatar_url}
            mainText={`u/${profile.username}`}
            subText={profile.name ?? profile.username}
          />
        ))}
      </PopoverContent>
    </Popover>
  );
}
