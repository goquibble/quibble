"use client";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { timeAgo } from "@/lib/utils";
import { getQuib } from "@/services/quib";
import { CoverCard } from "../cover-card";
import QuibActions from "../quib-actions";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

export default function Quib() {
  const { name, id, slug } = useParams<{
    name: string;
    id: string;
    slug: string;
  }>();

  const { data: quib } = useQuery({
    queryKey: ["quiblet", name, "quib", id, slug],
    queryFn: () => getQuib(name, id, slug),
  });

  if (!quib) return null;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button size={"icon-sm"} variant={"outline"}>
          <ArrowLeft />
        </Button>
        <Avatar>
          <AvatarImage src={quib.quiblet.avatar ?? ""} />
          <AvatarFallback seed={quib.quiblet.name} />
        </Avatar>
        <div className="flex flex-col gap-1 text-sm/none">
          <Link
            href={`/q/${quib.quiblet.name}`}
            className="font-semibold transition-colors hover:text-primary"
          >
            q/{quib.quiblet.name}
          </Link>
          <span className="font-medium text-muted-foreground">
            {quib.poster.username}
          </span>
        </div>
        <span className="text-muted-foreground text-xs/none">
          — {timeAgo(quib.created_at)}
        </span>
      </div>
      <h1 className="font-bold text-2xl dark:text-white/90">{quib.title}</h1>
      {quib.cover && (
        <CoverCard
          cover={quib.cover}
          cover_small={quib.cover_small}
          className="aspect-video"
        />
      )}
      {quib.content?.trim() && (
        <p className="whitespace-pre-wrap text-sm">{quib.content}</p>
      )}
      <QuibActions
        name={quib.quiblet.name}
        id={quib.id}
        slug={quib.slug}
        upvotes={quib.upvotes}
        downvotes={quib.downvotes}
        user_vote_value={quib.user_vote_value}
        showMoreBtn={false}
        className="mt-2"
      />
    </div>
  );
}
