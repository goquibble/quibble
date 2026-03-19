"use client";
import { ExternalLink, ImageOff } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn, timeAgo } from "@/lib/utils";
import type { Quib } from "@/types/quib";
import { CoverCard } from "../cover-card";
import QuibActions from "../quib-actions";
import { Button } from "../ui/button";
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
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        setIsOverflowing(
          contentRef.current.scrollHeight > contentRef.current.clientHeight,
        );
      }
    };

    requestAnimationFrame(checkOverflow);
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  if (layout === "compact") {
    return (
      <div className="relative flex items-start gap-4 rounded-lg border p-3 hover:bg-muted/50">
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

          <h2 className="line-clamp-2 font-bold text-lg leading-tight">
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
    <div className="relative flex flex-col gap-2 rounded-lg border p-4 hover:bg-muted/50">
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
      <h2 className="font-bold text-xl">{title}</h2>
      {cover ? (
        <CoverCard
          cover={cover}
          cover_small={cover_small}
          className="aspect-video"
        />
      ) : content?.trim() ? (
        <div className="relative">
          <div
            ref={contentRef}
            className={cn(
              "max-h-[150px] overflow-hidden",
              isOverflowing && "mask-b-from-50%",
            )}
          >
            <MarkdownViewer content={content} />
          </div>
          {isOverflowing && (
            <Button
              variant={"outline"}
              className="absolute inset-x-0 bottom-0 mx-auto w-max bg-input!"
            >
              Read More <ExternalLink />
            </Button>
          )}
        </div>
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
