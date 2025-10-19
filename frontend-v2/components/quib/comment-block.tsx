import type { TreeNode } from "@/lib/build-tree";
import { cn } from "@/lib/utils";
import type { Comment } from "@/types/comment";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function CommentBlock({
  commenter,
  content,
  children,
}: TreeNode<Comment>) {
  return (
    <div className="mt-2 flex gap-2">
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
        {children.length > 0 &&
          children.map((child) => <CommentBlock key={child.id} {...child} />)}
      </div>
    </div>
  );
}
