import type { TreeNode } from "@/lib/build-tree";
import { cn, timeAgo } from "@/lib/utils";
import type { Comment } from "@/types/comment";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import CommentActions from "./comment-actions";

export default function CommentBlock({
  upvotes,
  downvotes,
  user_vote_value,
  commenter,
  content,
  created_at,
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
      <div className="flex flex-col gap-1">
        <div className="flex flex-col">
          <span className="flex items-center gap-1">
            <span className="font-medium text-sm">u/{commenter.username}</span>
            <span className="text-muted-foreground text-xs">
              — {timeAgo(created_at)}
            </span>
          </span>
          <span className="text-muted-foreground text-sm/none">
            {commenter.name ?? commenter.username}
          </span>
        </div>
        <p className="mt-1 whitespace-pre-wrap text-sm">{content}</p>
        <CommentActions
          upvotes={upvotes}
          downvotes={downvotes}
          user_vote_value={user_vote_value}
        />
        {children.length > 0 &&
          children.map((child) => <CommentBlock key={child.id} {...child} />)}
      </div>
    </div>
  );
}
