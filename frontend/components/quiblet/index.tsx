"use client";

import { useQuery } from "@tanstack/react-query";
import { BellOff, Ellipsis, Plus, Star } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { getQuiblet } from "@/services/quiblet";
import { useAuthStore } from "@/stores/auth";
import { useRecentStore } from "@/stores/recent";
import type { Quiblet as IQuiblet } from "@/types/quiblet";
import Quiblet404 from "../quiblet-404";
import QuibletHighlights from "../quiblet-highlights";
import QuibletQuibs from "../quiblet-quibs";
import QuibletJoinBtn from "./quiblet-join-btn";

export default function Quiblet() {
  const { name } = useParams<{ name: string }>();
  const { data: quiblet, error } = useQuery<IQuiblet>({
    queryKey: ["quiblet", name],
    queryFn: () => getQuiblet(name),
  });
  const { userProfile } = useAuthStore();
  const { addRecentQuiblet, toggleFavoriteQuiblet, getRecentQuiblets } =
    useRecentStore();

  const isFavorite =
    userProfile && quiblet
      ? getRecentQuiblets(userProfile.username).find(
          (q) => q.name === quiblet.name,
        )?.isStarred
      : false;

  useEffect(() => {
    if (quiblet && userProfile) {
      addRecentQuiblet(userProfile.username, {
        name: quiblet.name,
        avatar_url: quiblet.avatar_url ?? "",
      });
    }
  }, [quiblet, userProfile, addRecentQuiblet]);

  if (error) return <Quiblet404 name={name} />;
  if (!quiblet) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="h-16 w-full rounded-md border bg-muted/30 md:h-20" />
      <div className="relative flex flex-wrap items-center gap-2 px-4">
        <Avatar className="absolute bottom-11 size-15 rounded-full ring-4 ring-background md:bottom-0 md:size-20">
          <AvatarImage src={quiblet.avatar_url ?? ""} alt={quiblet.name} />
          <AvatarFallback seed={quiblet.name} />
        </Avatar>
        <h1 className="pl-17 font-bold text-2xl text-white/90 md:pl-22 md:text-3xl">
          q/{quiblet.name}
        </h1>
        <Link href={`/submit?q=${quiblet.name}`} className="-ml-4 md:ml-auto">
          <Button variant={"outline"}>
            <Plus />
            Create Quib
          </Button>
        </Link>
        <QuibletJoinBtn name={quiblet.name} hasJoined={quiblet.has_joined} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"icon"}>
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                userProfile &&
                toggleFavoriteQuiblet(userProfile.username, quiblet.name)
              }
              disabled={!userProfile}
            >
              <Star
                className={cn(
                  "size-4",
                  isFavorite && "fill-primary stroke-primary",
                )}
              />
              {isFavorite ? "Remove from favorites" : "Add to favorites"}
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <BellOff />
              Mute q/{quiblet.name}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <QuibletHighlights name={name} />
      <QuibletQuibs name={name} />
    </div>
  );
}
