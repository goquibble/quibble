import {
  ArrowBigDown,
  ArrowBigUp,
  Ellipsis,
  Forward,
  Reply,
} from "lucide-react";
import type { TreeNode } from "@/lib/build-tree";
import { cn } from "@/lib/utils";
import type { Comment } from "@/types/comment";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

export default function CommentBlock({
  upvotes,
  downvotes,
  user_vote_value,
  commenter,
  content,
  children,
}: TreeNode<Comment>) {
  return (
    <div className="flex gap-2">
      <div className="flex flex-col gap-2">
        <Avatar className="size-7">
          <AvatarImage src={commenter.avatar ?? ""} />
          <AvatarFallback seed={commenter.username} />
        </Avatar>
        <button
          type="button"
          className={cn(
            "group flex-1 justify-center",
            children.length ? "flex" : "hidden",
          )}
        >
          <span className="h-full w-0.5 rounded-full bg-border transition-colors group-hover:bg-primary"></span>
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <span className="flex items-center gap-1">
            <span className="font-medium text-sm">u/{commenter.username}</span>
            <span className="text-muted-foreground text-xs">— 12hr ago</span>
          </span>
          <span className="text-muted-foreground text-sm/none">
            {commenter.name ?? commenter.username}
          </span>
        </div>
        <p className="whitespace-pre-wrap text-sm">{content}</p>
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="flex items-center gap-0.5">
            <Button size={"icon-sm"} variant={"ghost"}>
              <ArrowBigUp />
            </Button>
            <span className="font-bold text-xs">{upvotes - downvotes}</span>
            <Button size={"icon-sm"} variant={"ghost"}>
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
        {children.length > 0 &&
          children.map((child) => <CommentBlock key={child.id} {...child} />)}
      </div>
    </div>
  );
}
