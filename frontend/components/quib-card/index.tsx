"use client";
import { ImageOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { timeAgo } from "@/lib/utils";
import type { Quib } from "@/types/quib";
import { CoverCard } from "../cover-card";
import QuibActions from "../quib-actions";
import { MarkdownViewer } from "../ui/markdown-viewer";
import QuibSource from "./quib-source";

interface QuibCardProps extends Quib {
  layout?: "card" | "compact";
}

export default function QuibCard({
  layout = "card",
  upvotes,
  downvotes,
  user_vote_value,
  comments_count,
  quiblet,
  poster,
  id,
  slug,
  title,
  cover,
  cover_small,
  content,
  created_at,
}: QuibCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  if (layout === "compact") {
    return (
      <div className="group relative flex items-start gap-4 rounded-lg border p-3 hover:bg-muted/50">
        <Link
          href={`/q/${quiblet.name}/quib/${id}/${slug}`}
          className="absolute inset-0 z-4"
        />

        {/* left Side: Thumbnail */}
        {cover ? (
          <CoverCard
            cover={cover}
            cover_small={cover_small}
            className="size-23 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="flex size-23 shrink-0 items-center justify-center rounded-lg border bg-muted/50">
            <ImageOff className="size-6 text-muted-foreground" />
          </div>
        )}

        {/* Right Side: Content */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-2 text-xs">
            <QuibSource quiblet={quiblet} poster={poster} />
            <span className="text-muted-foreground">
              — {timeAgo(created_at)}
            </span>
          </div>

          <h2 className="line-clamp-2 font-bold text-lg leading-tight decoration-2 decoration-primary group-hover:underline dark:text-white/90">
            {title}
          </h2>

          <div className="mt-1">
            <QuibActions
              id={id}
              slug={slug}
              upvotes={upvotes}
              downvotes={downvotes}
              user_vote_value={user_vote_value}
              name={quiblet.name}
              comments_count={comments_count}
              compact
              isExpanded={isExpanded}
              onToggleExpand={handleToggleExpand}
            />
          </div>

          {isExpanded && (
            <div className="relative z-5">
              {cover ? (
                <CoverCard
                  cover={cover}
                  cover_small={cover_small}
                  className="mt-2 aspect-video w-full"
                />
              ) : content?.trim() ? (
                <MarkdownViewer content={content} />
              ) : null}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col gap-2 rounded-lg border p-4 hover:bg-muted/50">
      <Link
        href={`/q/${quiblet.name}/quib/${id}/${slug}`}
        className="absolute inset-0 z-4"
      />
      <div className="flex items-center gap-2">
        <QuibSource quiblet={quiblet} poster={poster} />
        <span className="text-muted-foreground text-xs">
          — {timeAgo(created_at)}
        </span>
      </div>
      <h2 className="font-bold text-xl decoration-2 decoration-primary group-hover:underline dark:text-white/90">
        {title}
      </h2>
      {cover ? (
        <CoverCard
          cover={cover}
          cover_small={cover_small}
          className="aspect-video"
        />
      ) : content?.trim() ? (
        <MarkdownViewer content={content} />
      ) : null}
      <QuibActions
        id={id}
        slug={slug}
        upvotes={upvotes}
        downvotes={downvotes}
        user_vote_value={user_vote_value}
        name={quiblet.name}
        comments_count={comments_count}
      />
    </div>
  );
}
