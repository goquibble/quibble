"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { createComment } from "@/services/comment";
import type { Comment } from "@/types/comment";
import type { Quib } from "@/types/quib";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface CommentBoxProps extends Pick<Quib, "id" | "slug"> {
  name: string;
  className?: string;
}

export default function CommentBox({
  name,
  id,
  slug,
  className,
}: CommentBoxProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (content: string) =>
      createComment(name, id, slug, { content: content }),
    onSuccess: (newComment) => {
      const cacheKey = ["quiblet", name, "quib", id, slug, "comments"];
      queryClient.setQueryData(cacheKey, (old: Comment[]) => [
        newComment,
        ...old,
      ]);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const content = formData.get("content")?.toString();

    if (content?.trim()) {
      mutation.mutate(content);
    }
  };

  return (
    <div className={cn(className)}>
      {open ? (
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <Textarea
            autoFocus
            name="content"
            placeholder="Add your comment"
            className="scrollbar-hide"
          />
          <div className="flex gap-2">
            <Button
              size={"sm"}
              variant={"outline"}
              className="ml-auto"
              disabled={mutation.isPending}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size={"sm"} disabled={mutation.isPending}>
              Comment
            </Button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          className="flex w-full cursor-text items-center gap-2 rounded-md border bg-input/30 p-2 px-3"
          onClick={() => setOpen(true)}
        >
          <MessageCircle className="size-4 text-muted-foreground" />
          <span className="text-muted-foreground text-sm">
            Add your comment
          </span>
        </button>
      )}
    </div>
  );
}
