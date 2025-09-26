"use client";
import { useQuery } from "@tanstack/react-query";
import { BellOff, Ellipsis, Plus, Star } from "lucide-react";
import { useParams } from "next/navigation";
import QuibCard from "@/components/quib-card";
import QuibHeader from "@/components/quib-header/quib-header";
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

export default function Quiblet() {
  const { name } = useParams<{ name: string }>();
  const {
    data: quiblet,
    error,
    isLoading,
  } = useQuery<IQuiblet>({
    queryKey: ["quiblet", name],
    queryFn: () => getQuiblet(name),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Quiblet not found (404)</div>;
  }

  if (!quiblet) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="h-20 w-full rounded-md border bg-muted/30" />
      <div className="relative flex items-center gap-2 px-4">
        <Avatar className="absolute bottom-0 size-20 ring-4 ring-background">
          <AvatarImage src={quiblet.avatar ?? ""} alt={quiblet.name} />
          <AvatarFallback>{quiblet.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <h1 className="pl-22 font-bold text-3xl text-white/90">
          q/{quiblet.name}
        </h1>
        <Button variant={"outline"} className="ml-auto">
          <Plus />
          Create Quib
        </Button>
        <Button variant={"outline"}>Joined</Button>
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
      <div className="mt-2">
        <QuibHeader />
        <QuibCard />
      </div>
    </div>
  );
}
