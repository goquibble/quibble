import { MinusCircle, PlusCircle } from "lucide-react";
import { useState } from "react";
import type { TreeNode } from "@/lib/build-tree";
import { cn, timeAgo } from "@/lib/utils";
import type { Comment } from "@/types/comment";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { MarkdownViewer } from "../ui/markdown-viewer";
import CommentActions from "./comment-actions";
import CommentBox from "./comment-box";

interface CommentBlockProps extends TreeNode<Comment> {
  quiblet_name: string;
  quib_id: string;
  quib_slug: string;
}

export default function CommentBlock({
  path,
  upvotes,
  downvotes,
  user_vote_value,
  commenter,
  content,
  created_at,
  is_deleted,
  children,
  // quib(let) props
  quiblet_name,
  quib_id,
  quib_slug,
}: CommentBlockProps) {
  const [openReply, setOpenReply] = useState(false);
  // collapse if comment is deleted (initial)
  const [isCollapsed, setIsCollapsed] = useState(is_deleted);
  const CollapseIcon = isCollapsed ? PlusCircle : MinusCircle;

  return (
    <div className="flex gap-2">
      <div className="flex flex-col gap-2">
        <Avatar className="size-7">
          <AvatarImage src={commenter?.avatar ?? ""} />
          <AvatarFallback seed={commenter?.username} />
        </Avatar>
        <div
          className={cn(
            "group relative flex-1 justify-center",
            children.length ? "flex" : "hidden",
          )}
        >
          <button
            type="button"
            className="flex flex-1 justify-center"
            onClick={() => setIsCollapsed((prev) => !prev)}
          >
            <span className="h-full w-0.5 rounded-full bg-border transition-colors group-hover:bg-primary"></span>
          </button>
          <button
            type="button"
            className="pointer-events-none absolute size-5 rounded-full bg-background ring-4 ring-background"
          >
            <CollapseIcon className="size-full text-muted-foreground group-hover:text-primary" />
          </button>
        </div>
      </div>
      <div className="flex w-full flex-col gap-1">
        <div className="flex flex-col">
          <span className="flex items-center gap-1">
            <span className="font-medium text-sm">
              {is_deleted ? "[deleted]" : `u/${commenter?.username}`}
            </span>
            <span className="text-muted-foreground text-xs">
              — {timeAgo(created_at)}
            </span>
          </span>
          <span className="text-muted-foreground text-sm/none">
            {is_deleted ? "deleted" : (commenter?.name ?? commenter?.username)}
          </span>
        </div>
        <MarkdownViewer content={content} className="mt-1" />
        <CommentActions
          upvotes={upvotes}
          downvotes={downvotes}
          user_vote_value={user_vote_value}
          onReplyClick={() => setOpenReply((prev) => !prev)}
        />
        {openReply && (
          <CommentBox
            name={quiblet_name}
            id={quib_id}
            slug={quib_slug}
            parentPath={path}
            onCancelClick={() => setOpenReply(false)}
            className="mt-2"
          />
        )}
        {!isCollapsed &&
          children.length > 0 &&
          children.map((child) => (
            <CommentBlock
              key={child.id}
              {...child}
              quiblet_name={quiblet_name}
              quib_id={quib_id}
              quib_slug={quib_slug}
            />
          ))}
      </div>
    </div>
  );
}
