import {
  ArrowBigDown,
  ArrowBigUp,
  MessagesSquare,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

export default function QuibCard() {
  return (
    <div className="group relative flex flex-col gap-2 rounded-md border bg-muted/25 p-4 transition-colors hover:bg-muted/50">
      <Link href={`/q/quibble-dev/sxd2sh`} className="absolute inset-0" />
      <div className="flex items-center gap-2">
        <Link
          href={`/q/quibble-dev`}
          className="relative flex items-center gap-2 hover:underline"
        >
          <Avatar className="size-6">
            <AvatarImage src={`https://github.com/quibble-dev.png`} />
            <AvatarFallback>QD</AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm">q/quibble-dev</span>
        </Link>
        <span className="text-muted-foreground text-xs">— 1hr ago</span>
      </div>
      <h2 className="font-bold text-xl group-hover:underline dark:text-white/90">
        Just finished my first side project!
      </h2>
      <p className="text-sm">
        I'm excited to share that I've completed my first side project! It was a
        great learning experience that challenged me to apply new skills and
        bring an idea to life.
        <br />
        <br />
        I'm really looking forward to diving into more projects soon and
        continuing to grow my skills and knowledge through hands-on experience.
      </p>
      <div className="relative flex w-max items-center gap-2">
        <div className="flex items-center gap-1">
          <Button
            size={"icon-sm"}
            variant={"ghost"}
            className="hover:text-primary"
          >
            <ArrowBigUp />
          </Button>
          <span className="font-medium text-sm">15</span>
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
