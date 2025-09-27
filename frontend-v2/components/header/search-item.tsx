import Link from "next/link";
import type { Nullable } from "@/types/generics";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface SearchItemProps {
  href: string;
  avatar: Nullable<string>;
  mainText: string;
  subText: string;
}

export default function SearchItem({
  href,
  avatar,
  mainText,
  subText,
}: SearchItemProps) {
  return (
    <Link href={href} className="flex items-center gap-2">
      <Avatar>
        <AvatarImage src={avatar ?? ""} />
        {/* mainText[2] removes first "q/" or "u/" strings */}
        <AvatarFallback>{mainText[2]}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="font-medium text-sm">{mainText}</span>
        <span className="text-muted-foreground text-sm/none">{subText}</span>
      </div>
    </Link>
  );
}
