"use client";
import {
  ArrowBigDown,
  ArrowBigUp,
  Ellipsis,
  Forward,
  Reply,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Comment } from "@/types/comment";
import { Button } from "../ui/button";

type Vote = "up" | "down";
type VoteState = { voteCount: number; myVote: Vote | null };

type CommentActionsProps = Pick<
  Comment,
  "upvotes" | "downvotes" | "user_vote_value"
>;

export default function CommentActions({
  upvotes,
  downvotes,
  user_vote_value,
}: CommentActionsProps) {
  const [voteState, _setVoteState] = useState<VoteState>({
    voteCount: upvotes - downvotes,
    myVote:
      user_vote_value === 1 ? "up" : user_vote_value === -1 ? "down" : null,
  });

  return (
    <div className="flex items-center gap-1 text-muted-foreground">
      <div className="flex items-center gap-0.5">
        <Button
          size={"icon-sm"}
          variant={"ghost"}
          className={cn(
            voteState.myVote === "up" && "text-primary hover:text-primary",
          )}
        >
          <ArrowBigUp />
        </Button>
        <span className="font-bold text-sm">{voteState.voteCount}</span>
        <Button
          size={"icon-sm"}
          variant={"ghost"}
          className={cn(
            voteState.myVote === "down" &&
              "text-secondary hover:text-secondary",
          )}
        >
          <ArrowBigDown />
        </Button>
      </div>
      <Button size={"sm"} variant={"ghost"}>
        <Reply />
        Reply
      </Button>
      <Button size={"sm"} variant={"ghost"}>
        <Forward />
        Share
      </Button>
      <Button size={"icon-sm"} variant={"ghost"}>
        <Ellipsis />
      </Button>
    </div>
  );
}
