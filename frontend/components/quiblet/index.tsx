"use client";
import { useQuery } from "@tanstack/react-query";
import { BellOff, Ellipsis, Plus, Star } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getQuiblet } from "@/services/quiblet";
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

  if (error) return <Quiblet404 name={name} />;
  if (!quiblet) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="h-20 w-full rounded-md border bg-muted/30" />
      <div className="relative flex items-center gap-2 px-4">
        <Avatar className="absolute bottom-0 size-20 rounded-full ring-4 ring-background">
          <AvatarImage src={quiblet.avatar ?? ""} alt={quiblet.name} />
          <AvatarFallback seed={quiblet.name} />
        </Avatar>
        <h1 className="pl-22 font-bold text-3xl text-white/90">
          q/{quiblet.name}
        </h1>
        <Link href={`/submit?q=${quiblet.name}`} className="ml-auto">
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
            <DropdownMenuItem>
              <Star />
              Add to favorities
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
