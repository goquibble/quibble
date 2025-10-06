import {
  ArrowBigDown,
  ArrowBigUp,
  MessagesSquare,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { FeedQuib } from "@/types/feed";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

interface QuibCardProps extends FeedQuib {
  // add props later for quiblet page
}

export default function QuibCard({
  upvotes,
  downvotes,
  quiblet,
  id,
  slug,
  title,
  cover,
  cover_small,
  content,
}: QuibCardProps) {
  return (
    <div className="group relative flex flex-col gap-2 rounded-lg border bg-muted/25 p-4 transition-colors hover:bg-muted/50">
      <Link
        href={`/q/${quiblet.name}/quib/${id}/${slug}`}
        className="absolute inset-0"
      />
      <div className="flex items-center gap-2">
        <Link
          href={`/q/${quiblet.name}`}
          className="relative flex items-center gap-2 hover:underline"
        >
          <Avatar className="size-6">
            <AvatarImage src={quiblet.avatar ?? ""} />
            <AvatarFallback>{quiblet.name[0]}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm">q/{quiblet.name}</span>
        </Link>
        <span className="text-muted-foreground text-xs">— 1hr ago</span>
      </div>
      <h2 className="font-bold text-xl group-hover:underline dark:text-white/90">
        {title}
      </h2>
      {content ? (
        <p className="text-sm">{content}</p>
      ) : (
        <div
          className="relative aspect-video overflow-hidden rounded-lg bg-center bg-cover bg-no-repeat"
          style={{ backgroundImage: `url(${cover_small})` }}
        >
          <div className="absolute inset-0 z-1 bg-background/50 backdrop-blur-md"></div>
          <div className="pointer-events-none absolute inset-0 z-3 rounded-lg border border-foreground/15"></div>
          <Image
            src={cover ?? ""}
            alt={`cover-${slug}`}
            fill
            className="z-2 object-contain"
          />
        </div>
      )}
      <div className="relative flex w-max items-center gap-2">
        <div className="flex items-center gap-2 rounded-lg border border-accent/50 bg-muted p-1">
          <Button
            size={"icon-sm"}
            variant={"default"}
            className="hover:text-primary"
          >
            <ArrowBigUp />
          </Button>
          <span className="font-medium text-sm">{upvotes}</span>
          <Button
            size={"icon-sm"}
            variant={"ghost"}
            className="hover:text-secondary"
          >
            <ArrowBigDown />
          </Button>
        </div>
        <Button size={"sm"} variant={"ghost"}>
          <MessagesSquare />
          <span className="font-medium text-sm">4</span>
        </Button>
        <Button size={"sm"} variant={"ghost"}>
          <Share2 />
          <span className="font-medium text-sm">Share</span>
        </Button>
        <Button size={"icon-sm"} variant={"ghost"}>
          <MoreHorizontal />
        </Button>
      </div>
    </div>
  );
}
