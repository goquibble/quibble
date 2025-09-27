"use client";
import { Search } from "lucide-react";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
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
      <PopoverAnchor>
        <IconInput
          Icon={Search}
          placeholder="Search..."
          wrapperClassName="ml-2"
          className="w-100"
          onChange={debouncedOnChange}
        />
      </PopoverAnchor>
      <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>
  );
}
