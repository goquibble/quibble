import { Star } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

interface QuibletItemProps {
  name: string;
  avatar: string;
  isStarred: boolean;
}

export default function QuibletItem({
  name,
  avatar,
  isStarred,
}: QuibletItemProps) {
  return (
    <div className="flex items-center gap-2 rounded-md p-1.5 hover:bg-muted">
      <Link href={`/q/${name}`} className="flex flex-1 items-center gap-2">
        <Avatar className="size-6">
          <AvatarImage src={avatar} />
          <AvatarFallback>{name}</AvatarFallback>
        </Avatar>
        <span className="font-medium text-sm">q/{name}</span>
      </Link>
      <Button size={"icon"} variant={"ghost"} className="ml-auto size-6">
        <Star
          className={cn(
            "size-4",
            isStarred ? "fill-primary stroke-primary" : "stroke-secondary",
          )}
        />
      </Button>
    </div>
  );
}
