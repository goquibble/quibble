"use client";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Search } from "lucide-react";
import { useParams } from "next/navigation";
import { getQuib } from "@/services/quib";
import { CoverCard } from "../cover-card";
import QuibActions from "../quib-actions";
import { Button } from "../ui/button";
import IconInput from "../ui/icon-input";
import CommentBox from "./comment-box";
import Comments from "./comments";
import QuibMeta from "./quib-meta";

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
      <QuibMeta
        quiblet={quib.quiblet}
        poster={quib.poster}
        created_at={quib.created_at}
      />
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
      <CommentBox />
      <div className="flex items-center gap-2">
        <span className="whitespace-nowrap text-muted-foreground text-sm">
          Sort by:
        </span>
        <Button size={"sm"} variant={"ghost"} disabled>
          Best
          <ChevronDown />
        </Button>
        <IconInput
          Icon={Search}
          placeholder="Search comments"
          className="w-auto"
          disabled
        />
      </div>
      <Comments />
    </div>
  );
}
