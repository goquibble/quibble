import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Search } from "@/types/search";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface SearchQuibletItemProps {
  quiblet: Search["quiblets"][number];
}

export default function SearchQuibletItem({ quiblet }: SearchQuibletItemProps) {
  return (
    <Link
      key={quiblet.id}
      href={`/q/${quiblet.name}`}
      className="group flex items-center gap-2"
    >
      <Avatar>
        <AvatarImage src={quiblet.avatar ?? ""} alt={quiblet.name} />
        <AvatarFallback>Q</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="font-medium text-sm">q/{quiblet.name}</span>
        <span className="text-muted-foreground text-sm/none">
          {quiblet.members_count} member(s)
        </span>
      </div>
      <ChevronRight
        className={cn(
          "ml-auto size-5 text-muted-foreground opacity-0 duration-250",
          "group-hover:slide-in-from-left-25 group-hover:animate-in group-hover:opacity-100",
        )}
      />
    </Link>
  );
}
