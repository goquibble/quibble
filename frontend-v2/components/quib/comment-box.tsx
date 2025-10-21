"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { createComment } from "@/services/comment";
import type { Comment } from "@/types/comment";
import type { Quib } from "@/types/quib";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface CommentBoxProps extends Pick<Quib, "id" | "slug"> {
  name: string;
  className?: string;
  parent_path?: string;
  setOpenCommentBox: (open: boolean) => void;
}

export default function CommentBox({
  name,
  id,
  slug,
  className,
  parent_path,
  setOpenCommentBox,
}: CommentBoxProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (content: string) =>
      createComment(name, id, slug, { content, parent_path }),
    onSuccess: (newComment) => {
      const cacheKey = ["quiblet", name, "quib", id, slug, "comments"];
      queryClient.setQueryData(cacheKey, (old: Comment[]) => [
        newComment,
        ...old,
      ]);
      // close comment box to reset content
      setOpenCommentBox(false);
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
    <form
      className={cn("flex flex-col gap-2", className)}
      onSubmit={handleSubmit}
    >
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
          onClick={() => setOpenCommentBox(false)}
        >
          Cancel
        </Button>
        <Button type="submit" size={"sm"} disabled={mutation.isPending}>
          Comment
        </Button>
      </div>
    </form>
  );
}
