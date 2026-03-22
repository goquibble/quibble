"use client";
import { useQuery } from "@tanstack/react-query";
import { Book, CakeSlice, Globe } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { getQuiblet } from "@/services/quiblet";
import type { Quiblet } from "@/types/quiblet";
import LegalLinks from "./legal-links";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

export default function QuibletInfo() {
  const { name } = useParams<{ name: string }>();
  const { data: quiblet } = useQuery<Quiblet>({
    queryKey: ["quiblet", name],
    queryFn: () => getQuiblet(name),
  });

  if (!quiblet) {
    return null;
  }

  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-var(--spacing)*14)] w-75 flex-col gap-4 p-4 pl-0 md:flex">
      <div className="flex flex-col gap-1">
        <span className="font-bold">q/{quiblet.name}</span>
        <p className="font-medium text-muted-foreground text-sm">
          {quiblet.description}
        </p>
        <div className="flex items-center gap-2 text-muted-foreground">
          <CakeSlice className="size-4" />
          <span className="text-sm">
            Created {formatDate(quiblet.created_at)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Globe className="size-4" />
          <span className="text-sm capitalize">
            {quiblet.type.toLowerCase()}
          </span>
        </div>
      </div>
      <Button variant={"outline"} size={"sm"} disabled>
        <Book />
        Quiblet Guide
      </Button>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="font-bold text-sm">{quiblet.members_count}</span>
          <span className="text-muted-foreground text-sm">Member(s)</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm">{quiblet.quibs_count}</span>
          <span className="text-muted-foreground text-sm">Quib(s)</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-medium text-sm">Moderators</span>
        {quiblet.moderators.map((mod) => (
          <div key={mod.id} className="flex items-center gap-2">
            <Avatar className="rounded-none">
              <AvatarImage src={mod.avatar_url ?? ""} alt={mod.username} />
              <AvatarFallback seed={mod.username} />
            </Avatar>
            <div className="flex flex-col">
              <Link
                href={`/u/${mod.username}`}
                className="font-medium text-sm hover:underline"
              >
                u/{mod.username}
              </Link>
              <span className="text-muted-foreground text-sm/none">
                {mod.name ?? mod.username}
              </span>
            </div>
          </div>
        ))}
      </div>
      <LegalLinks />
    </aside>
  );
}
