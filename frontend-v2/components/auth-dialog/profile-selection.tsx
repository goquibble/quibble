import { useQuery } from "@tanstack/react-query";
import { Check, Plus } from "lucide-react";
import { useState } from "react";
import { useCsrfToken } from "@/hooks/use-csrf-token";
import { setProfileIdCookie } from "@/lib/cookies";
import { cn } from "@/lib/utils";
import { getUserProfiles } from "@/services/user";
import type { UserProfile } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

export default function ProfileSelection() {
  const csrfToken = useCsrfToken();
  const [selected, setSelected] = useState(0);

  const { data } = useQuery<UserProfile[]>({
    queryKey: ["user-profiles"],
    queryFn: () => getUserProfiles(csrfToken),
  });

  const handleSelect = () => {
    if (!data) return;

    const profileId = data[selected].id;
    setProfileIdCookie(profileId.toString());
    window.location.reload();
  };

  return (
    <>
      <span className="font-medium text-sm">Who's Quibbling?</span>
      <div className="grid grid-cols-3 gap-4">
        {data?.map((item, idx) => {
          const isSelected = selected === idx;

          return (
            <div
              key={`profile_${item.id}`}
              className="relative flex flex-col items-center gap-2"
            >
              <Avatar
                className="-outline-offset-1 aspect-square h-auto w-full cursor-pointer rounded-md outline outline-foreground/15"
                onClick={() => setSelected(idx)}
              >
                {/* TODO: add cover field */}
                <AvatarImage src="" />
                <AvatarFallback className="rounded-md font-black text-4xl">
                  {item.username.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <span
                className={cn(
                  "font-medium text-sm transition-opacity",
                  !isSelected && "opacity-75",
                )}
              >
                u/{item.username}
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
          hidden={(data?.length ?? 0) >= 3}
          type="button"
          className="grid aspect-square w-full place-items-center rounded-md border bg-muted/50 text-muted-foreground transition-colors hover:bg-muted/75"
        >
          <Plus className="size-8" />
        </button>
      </div>
      <Button onClick={handleSelect}>Start Quibbling</Button>
    </>
  );
}
