import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { createComment } from "@/services/comment";
import type { Comment } from "@/types/comment";
import type { Quib } from "@/types/quib";
import { Button } from "../ui/button";
import { MarkdownEditor } from "../ui/markdown-editor";

interface CommentBoxProps extends Pick<Quib, "id" | "slug"> {
  name: string;
  className?: string;
  parentPath?: string;
  onCancelClick: () => void;
}

export default function CommentBox({
  name,
  id,
  slug,
  className,
  parentPath,
  onCancelClick,
}: CommentBoxProps) {
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");

  const mutation = useMutation({
    mutationFn: (content: string) =>
      createComment(name, id, slug, { content, parentPath }),
    onSuccess: (newComment) => {
      onCancelClick();
      setContent("");
      // update cached data to include new comment
      const cacheKey = ["quiblet", name, "quib", id, slug, "comments"];
      queryClient.setQueryData(cacheKey, (old: Comment[]) => [
        newComment,
        ...old,
      ]);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (content?.trim()) {
      mutation.mutate(content);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-2", className)}
      onSubmit={handleSubmit}
    >
      <MarkdownEditor
        value={content}
        onChange={setContent}
        placeholder="Add your comment"
        className="min-h-[100px]"
        editorClassName="min-h-[100px]"
        autofocus={true}
      />
      <div className="flex gap-2">
        <Button
          size={"sm"}
          variant={"outline"}
          className="ml-auto"
          disabled={mutation.isPending}
          onClick={onCancelClick}
          type="button"
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
