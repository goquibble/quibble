import {
  ArrowBigDown,
  ArrowBigUp,
  MessagesSquare,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

export default function QuibCard() {
  return (
    <div className="group relative flex flex-col gap-2 rounded-lg border bg-muted/25 p-4 transition-colors hover:bg-muted/50">
      <Link href={`/q/quibblespace/sxd2sh`} className="absolute inset-0" />
      <div className="flex items-center gap-2">
        <Link
          href={`/q/quibblespace`}
          className="relative flex items-center gap-2 hover:underline"
        >
          <Avatar className="size-6">
            <AvatarImage src={`https://github.com/quibblespace.png`} />
            <AvatarFallback>Q</AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm">q/quibblespace</span>
        </Link>
        <span className="text-muted-foreground text-xs">— 1hr ago</span>
      </div>
      <h2 className="font-bold text-xl group-hover:underline dark:text-white/90">
        Just finished my first side project!
      </h2>
      <div
        hidden
        className="relative aspect-video overflow-hidden rounded-lg bg-cover bg-no-repeat"
        style={{ backgroundImage: "url(/_mock/img-1-small.jpg)" }}
      >
        <div className="absolute inset-0 z-1 bg-background/50 backdrop-blur-md"></div>
        <div className="pointer-events-none absolute inset-0 z-3 rounded-lg border border-foreground/15"></div>
        <Image
          src={"/_mock/img-1.jpg"}
          alt="img-1"
          fill
          className="z-2 object-contain"
        />
      </div>
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
        <div className="flex items-center gap-2 rounded-lg border border-accent/50 bg-muted p-1">
          <Button
            size={"icon-sm"}
            variant={"default"}
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
