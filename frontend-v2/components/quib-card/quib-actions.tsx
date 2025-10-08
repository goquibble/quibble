"use client";
import {
  ArrowBigDown,
  ArrowBigUp,
  MessagesSquare,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { FeedQuib } from "@/types/feed";
import type { Nullable } from "@/types/generics";
import { Button } from "../ui/button";

type Vote = "up" | "down";
type VoteState = { voteCount: number; myVote: Vote | null };

type QuibActionsProps = Pick<
  FeedQuib,
  "upvotes" | "downvotes" | "user_vote_value"
>;

export default function QuibActions({
  upvotes,
  downvotes,
  user_vote_value,
}: QuibActionsProps) {
  const [voteState, setVoteState] = useState<VoteState>({
    voteCount: upvotes - downvotes,
    myVote:
      user_vote_value === 1 ? "up" : user_vote_value === -1 ? "down" : null,
  });

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

  return (
    <div className="relative flex w-max items-center gap-2">
      <div className="flex items-center gap-1 rounded-lg border bg-input/30">
        <Button
          size={"icon-sm"}
          variant={voteState.myVote === "up" ? "default" : "ghost"}
          className={cn(voteState.myVote !== "up" && "hover:text-primary")}
          onClick={() => handleVote("up")}
        >
          <ArrowBigUp />
        </Button>
        <span className="font-medium text-sm">{voteState.voteCount}</span>
        <Button
          size={"icon-sm"}
          variant={voteState.myVote === "down" ? "secondary" : "ghost"}
          className={cn(voteState.myVote !== "down" && "hover:text-secondary")}
          onClick={() => handleVote("down")}
        >
          <ArrowBigDown />
        </Button>
      </div>
      <Button size={"sm"} variant={"outline"}>
        <MessagesSquare />
        <span className="font-medium text-sm">4</span>
      </Button>
      <Button size={"sm"} variant={"outline"}>
        <Share2 />
        <span className="font-medium text-sm">Share</span>
      </Button>
      <Button size={"icon-sm"} variant={"ghost"}>
        <MoreHorizontal />
      </Button>
    </div>
  );
}
