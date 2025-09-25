import { BellOff, Ellipsis, Plus, Star } from "lucide-react";
import type { Metadata } from "next";
import QuibCard from "@/components/quib-card";
import QuibHeader from "@/components/quib-header/quib-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export async function generateMetadata({
  params,
}: PageProps<"/q/[name]">): Promise<Metadata> {
  const { name } = await params;

  return {
    title: `q/${name}`,
  };
}

export default async function Quiblet({ params }: PageProps<"/q/[name]">) {
  const { name } = await params;

  return (
    <div className="flex flex-col gap-2">
      <div className="h-20 w-full rounded-md border bg-muted/30" />
      <div className="relative flex items-center gap-2 px-4">
        <Avatar className="absolute bottom-0 size-20 ring-4 ring-background">
          <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <h1 className="pl-22 font-bold text-3xl text-white/90">q/{name}</h1>
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
              Mute q/{name}
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
