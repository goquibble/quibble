import { Check, Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

export default function ProfileSelection() {
  const [selected, setSelected] = useState(0);

  return (
    <>
      <span className="font-medium text-sm">Who's Quibbling?</span>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 1 }).map((_, idx) => {
          const isSelected = selected === idx;

          return (
            <div
              key={`item-${idx}`}
              className="relative flex flex-col items-center gap-2"
            >
              <Avatar
                className="-outline-offset-1 aspect-square h-auto w-full cursor-pointer rounded-md outline outline-foreground/15"
                onClick={() => setSelected(idx)}
              >
                <AvatarImage src="https://github.com/stabldev.png" />
                <AvatarFallback className="rounded-md">SD</AvatarFallback>
              </Avatar>
              <span
                className={cn(
                  "font-medium text-sm transition-opacity",
                  !isSelected && "opacity-75",
                )}
              >
                u/stabldev
              </span>
              {isSelected && (
                <span className="zoom-in-50 fade-in absolute top-0 right-0 grid size-5 animate-in place-items-center rounded-full bg-primary ring-4 ring-background">
                  <Check className="size-2/3 stroke-3 text-primary-foreground" />
                </span>
              )}
            </div>
          );
        })}
        <button
          type="button"
          className="grid aspect-square w-full place-items-center rounded-md border bg-muted/50 text-muted-foreground transition-colors hover:bg-muted/75"
        >
          <Plus className="size-8" />
        </button>
      </div>
      <Button>Start Quibbling</Button>
    </>
  );
}
