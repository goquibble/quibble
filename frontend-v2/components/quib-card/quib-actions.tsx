"use client";
import {
  ArrowBigDown,
  ArrowBigUp,
  MessagesSquare,
  MoreHorizontal,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import type { FeedQuib } from "@/types/feed";
import type { Nullable } from "@/types/generics";
import { Button } from "../ui/button";
import QuibShareBtn from "./quib-share.btn";

type Vote = "up" | "down";
type VoteState = { voteCount: number; myVote: Vote | null };

interface QuibActionsProps
  extends Pick<
    FeedQuib,
    "upvotes" | "downvotes" | "user_vote_value" | "id" | "slug"
  > {
  quiblet_name: string;
}

export default function QuibActions({
  id,
  slug,
  upvotes,
  downvotes,
  user_vote_value,
  quiblet_name,
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
      await api.post(
        API_ENDPOINTS.QUIBLET_QUIB_VOTE(quiblet_name, id, slug, value),
      );
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
    <div className="flex w-max items-center gap-2">
      <div
        className={cn(
          "relative flex items-center gap-1 rounded-lg border",
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
      <QuibShareBtn id={id} slug={slug} quiblet_name={quiblet_name} />
      <Button size={"icon-sm"} variant={"ghost"} disabled>
        <MoreHorizontal />
      </Button>
    </div>
  );
}
