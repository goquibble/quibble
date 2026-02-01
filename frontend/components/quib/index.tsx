"use client";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, MessageCircle, Search } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { getQuib } from "@/services/quib";
import { CoverCard } from "../cover-card";
import { Button } from "../ui/button";
import IconInput from "../ui/icon-input";
import { MarkdownViewer } from "../ui/markdown-viewer";
import CommentBox from "./comment-box";
import Comments from "./comments";
import QuibMeta from "./quib-meta";
import QuibVote from "./quib-vote";

export default function Quib() {
  const { name, id, slug } = useParams<{
    name: string;
    id: string;
    slug: string;
  }>();

  const [openCommentBox, setOpenCommentBox] = useState(false);
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
        id={quib.id}
        slug={quib.slug}
      />
      <h1 className="font-bold text-2xl dark:text-white/90">{quib.title}</h1>
      {quib.cover && (
        <CoverCard
          cover={quib.cover}
          cover_small={quib.cover_small}
          className="aspect-video"
        />
      )}
      {quib.content?.trim() && <MarkdownViewer content={quib.content} />}
      <QuibVote
        name={quib.quiblet.name}
        id={quib.id}
        slug={quib.slug}
        upvotes={quib.upvotes}
        downvotes={quib.downvotes}
        comments_count={quib.comments_count}
        showMoreBtn={false}
        className="mt-2"
      />
      {openCommentBox ? (
        <CommentBox
          name={quib.quiblet.name}
          id={quib.id}
          slug={quib.slug}
          className="mt-2"
          onCancelClick={() => setOpenCommentBox(false)}
        />
      ) : (
        <button
          type="button"
          className="flex w-full cursor-text items-center gap-2 rounded-md border bg-input/30 p-2 px-3"
          onClick={() => setOpenCommentBox(true)}
        >
          <MessageCircle className="size-4 text-muted-foreground" />
          <span className="text-muted-foreground text-sm">
            Add your comment
          </span>
        </button>
      )}
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
          className="h-8 w-auto"
          disabled
        />
      </div>
      <Comments />
    </div>
  );
}
