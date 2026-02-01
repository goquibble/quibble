"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowBigDown,
  ArrowBigUp,
  Ellipsis,
  Forward,
  Reply,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { deleteComment } from "@/services/comment";
import type { Comment } from "@/types/comment";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type Vote = "up" | "down";
type VoteState = { voteCount: number; myVote: Vote | null };

interface CommentActionsProps
  extends Pick<Comment, "upvotes" | "downvotes" | "user_vote_value"> {
  onReplyClick: () => void;
  commentId: number;
  quibletName: string;
  quibId: string;
  quibSlug: string;
}

export default function CommentActions({
  upvotes,
  downvotes,
  user_vote_value,
  onReplyClick,
  commentId,
  quibletName,
  quibId,
  quibSlug,
}: CommentActionsProps) {
  // Import useQueryClient
  const queryClient = useQueryClient();
  const router = useRouter();
  const [voteState, _setVoteState] = useState<VoteState>({
    voteCount: upvotes - downvotes,
    myVote:
      user_vote_value === 1 ? "up" : user_vote_value === -1 ? "down" : null,
  });

  const handleDelete = async () => {
    const promise = deleteComment(quibletName, quibId, quibSlug, commentId);

    toast.promise(promise, {
      loading: "Deleting comment...",
      success: () => {
        // Optimistic update of the UI
        const queryKey = [
          "quiblet",
          quibletName,
          "quib",
          quibId,
          quibSlug,
          "comments",
        ];
        queryClient.setQueryData(
          queryKey,
          (oldComments: Comment[] | undefined) => {
            if (!oldComments) return [];
            return oldComments.map((comment) => {
              if (comment.id === commentId) {
                return { ...comment, is_deleted: true };
              }
              return comment;
            });
          },
        );

        router.refresh();
        return "Comment deleted";
      },
      error: "Failed to delete comment",
    });
  };

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
      <Button size={"sm"} variant={"ghost"} onClick={onReplyClick}>
        <Reply />
        Reply
      </Button>
      <Button size={"sm"} variant={"ghost"}>
        <Forward />
        Share
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"icon-sm"} variant={"ghost"}>
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={handleDelete}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
