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
import { Button } from "../ui/button";

interface QuibActionsProps {
  upvotes: number;
  downvotes: number;
}

export default function QuibActions({ upvotes, downvotes }: QuibActionsProps) {
  const [voteCount, _setVoteCount] = useState(upvotes - downvotes);
  const [myVote, setMyVote] = useState<"up" | "down" | null>(null);

  const handleVote = (vote: typeof myVote) => {
    setMyVote((prev) => (prev === vote ? null : vote));
  };

  return (
    <div className="relative flex w-max items-center gap-2">
      <div className="flex items-center gap-1 rounded-lg border bg-input/30">
        <Button
          size={"icon-sm"}
          variant={myVote === "up" ? "default" : "ghost"}
          className={cn(myVote !== "up" && "hover:text-primary")}
          onClick={() => handleVote("up")}
        >
          <ArrowBigUp />
        </Button>
        <span className="font-medium text-sm">{voteCount}</span>
        <Button
          size={"icon-sm"}
          variant={myVote === "down" ? "secondary" : "ghost"}
          className={cn(myVote !== "down" && "hover:text-secondary")}
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
