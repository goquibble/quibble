import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { timeAgo } from "@/lib/utils";
import type { Quib } from "@/types/quib";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

type QuibMetaProps = Pick<Quib, "quiblet" | "poster" | "created_at">;

export default function QuibMeta({
  quiblet,
  poster,
  created_at,
}: QuibMetaProps) {
  return (
    <div className="flex gap-2">
      <Button size={"icon-sm"} variant={"outline"}>
        <ArrowLeft />
      </Button>
      <Avatar>
        <AvatarImage src={quiblet.avatar ?? ""} />
        <AvatarFallback seed={quiblet.name} />
      </Avatar>
      <div className="flex flex-col gap-1 text-sm/none">
        <Link
          href={`/q/${quiblet.name}`}
          className="font-semibold transition-colors hover:text-primary"
        >
          q/{quiblet.name}
        </Link>
        <span className="font-medium text-muted-foreground">
          {poster.username}
        </span>
      </div>
      <span className="text-muted-foreground text-xs/none">
        — {timeAgo(created_at)}
      </span>
    </div>
  );
}
