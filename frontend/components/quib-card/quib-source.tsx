"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { Quib } from "@/types/quib";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface QuibSourceProps {
  quiblet: Quib["quiblet"];
  poster: Quib["poster"];
}

export default function QuibSource({ quiblet, poster }: QuibSourceProps) {
  const routerParams = useParams<{ name?: string }>();

  const href =
    routerParams.name && poster
      ? `/u/${poster.username}`
      : `/q/${quiblet.name}`;
  const avatarImage =
    routerParams.name && poster ? poster.avatar_url : quiblet.avatar;
  const sourceText =
    routerParams.name && poster ? `u/${poster.username}` : `q/${quiblet.name}`;

  return (
    <Link
      href={href}
      className="relative z-5 flex items-center gap-2 hover:text-primary"
    >
      <Avatar className="size-6">
        <AvatarImage src={avatarImage ?? ""} />
        <AvatarFallback seed={sourceText.slice(2)} />
      </Avatar>
      <span className="font-semibold text-sm">{sourceText}</span>
    </Link>
  );
}
