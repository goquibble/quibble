"use client";
import {
  ArrowBigDown,
  ArrowBigUp,
  Maximize2,
  MessagesSquare,
  Minimize2,
  MoreHorizontal,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Nullable } from "@/types/generics";
import type { Quib } from "@/types/quib";
import { Button } from "../ui/button";
import QuibShareBtn from "./quib-share-btn";

type Vote = "up" | "down";
type VoteState = { voteCount: number; myVote: Vote | null };

interface QuibActionsProps
  extends Pick<
    Quib,
    | "upvotes"
    | "downvotes"
    | "user_vote_value"
    | "comments_count"
    | "id"
    | "slug"
  > {
  name: string;
  onShareClick?: () => void;
  showMoreBtn?: boolean;
  className?: string;
  compact?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: (e: React.MouseEvent) => void;
}

export default function QuibActions({
  id,
  slug,
  upvotes,
  downvotes,
  user_vote_value,
  comments_count,
  name,
  onShareClick,
  showMoreBtn = true,
  className,
  compact = false,
  isExpanded = false,
  onToggleExpand,
}: QuibActionsProps) {
  const [voteState, setVoteState] = useState<VoteState>({
    voteCount: upvotes - downvotes,
    myVote:
      user_vote_value === 1 ? "up" : user_vote_value === -1 ? "down" : null,
  });
  const isFirstRender = useRef(true);
  const prevVote = useRef(voteState.myVote);

  const handleVote = (vote: Vote) => {
    setVoteState(({ voteCount, myVote }) => {
      let newVote: Nullable<Vote> = vote;
      let voteDiff = 0;

      if (myVote === vote) {
        newVote = null;
        voteDiff = vote === "up" ? -1 : 1;
      } else if (myVote === null) {
        voteDiff = vote === "up" ? 1 : -1;
      } else {
        voteDiff = vote === "up" ? 2 : -2;
      }

      return {
        voteCount: voteCount + voteDiff,
        myVote: newVote,
      };
    });
  };

  const debouncedVote = useDebouncedCallback(
    async (vote: VoteState["myVote"]) => {
      if (vote === prevVote.current) {
        return;
      }

      prevVote.current = vote;
      const value = vote === "up" ? 1 : vote === "down" ? -1 : 0;
      await api.post(API_ENDPOINTS.QUIBLET_QUIB_VOTE(name, id, slug, value));
    },
    500,
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    } // prevent running this on first render
    debouncedVote(voteState.myVote);
  }, [voteState.myVote, debouncedVote]);

  return (
    <div className={cn("flex w-max items-center gap-2", className)}>
      {compact && (
        <Button
          size="icon-sm"
          variant={"outline"}
          onClick={onToggleExpand}
          className="relative z-5 h-8 w-8"
        >
          {isExpanded ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      )}
      <div
        className={cn(
          "relative z-5 flex items-center gap-1 rounded-lg border",
          voteState.myVote === "up"
            ? "border-primary bg-primary/30"
            : voteState.myVote === "down"
              ? "border-secondary bg-secondary/30"
              : "border-border bg-input/30",
        )}
      >
        <Button
          size={"icon-sm"}
          variant={voteState.myVote === "up" ? "default" : "ghost"}
          className={cn(voteState.myVote !== "up" && "hover:text-primary")}
          onClick={() => handleVote("up")}
        >
          <ArrowBigUp className={cn(compact && "h-4 w-4")} />
        </Button>
        <span className="font-medium text-sm">{voteState.voteCount}</span>
        <Button
          size={"icon-sm"}
          variant={voteState.myVote === "down" ? "secondary" : "ghost"}
          className={cn(voteState.myVote !== "down" && "hover:text-secondary")}
          onClick={() => handleVote("down")}
        >
          <ArrowBigDown className={cn(compact && "h-4 w-4")} />
        </Button>
      </div>
      <Button
        size={"sm"}
        variant={"outline"}
        onClick={onShareClick}
        className={cn(compact && "px-2")}
      >
        <MessagesSquare className={cn(compact && "h-4 w-4")} />
        <span className="ml-1 text-xs">{comments_count}</span>
      </Button>
      <QuibShareBtn id={id} slug={slug} quiblet_name={name} compact={compact} />
      {showMoreBtn && (
        <Button
          size={"icon-sm"}
          variant={"ghost"}
          disabled
          className={cn(compact && "h-8 w-8")}
        >
          <MoreHorizontal className={cn(compact && "h-4 w-4")} />
        </Button>
      )}
    </div>
  );
}
