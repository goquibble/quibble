"use client";
import { CircleArrowOutUpRight, Flame, Rocket, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useInstantSearchParams } from "@/hooks/use-instant-search-params";
import { cn } from "@/lib/utils";

const sortMapping = {
  best: {
    Icon: Rocket,
    label: "Best",
    isDisabled: false,
  },
  hot: {
    Icon: Flame,
    label: "Hot",
    isDisabled: true,
  },
  new: {
    Icon: Sparkles,
    label: "New",
    isDisabled: true,
  },
  top: {
    Icon: CircleArrowOutUpRight,
    label: "Top",
    isDisabled: true,
  },
};

export default function QuibSort() {
  const [searchParams, setSearchParams] = useInstantSearchParams();
  const [activeSort, setActiveSort] =
    useState<keyof typeof sortMapping>("best");

  useEffect(() => {
    const sParam = searchParams.get("s");
    setActiveSort(
      sParam && Object.keys(sortMapping).includes(sParam)
        ? (sParam as keyof typeof sortMapping)
        : "best",
    );
  }, [searchParams]);

  return (
    <div className="flex items-center gap-4">
      {Object.entries(sortMapping).map(([key, item]) => {
        const isActive = key === activeSort;

        return (
          <button
            key={key}
            type="button"
            aria-pressed={isActive}
            aria-label={item.label}
            disabled={item.isDisabled}
            className={cn(
              "flex items-center gap-2",
              item.isDisabled && "pointer-events-none opacity-75",
            )}
            onClick={() => !isActive && setSearchParams("s", key)}
          >
            <item.Icon
              className={cn(
                "size-4",
                isActive && "fill-primary stroke-primary",
              )}
            />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
