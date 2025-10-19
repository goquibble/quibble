"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { buildTree } from "@/lib/build-tree";
import { getComments } from "@/services/comment";
import CommentBlock from "./comment-block";

export default function Comments() {
  const { name, id, slug } = useParams<{
    name: string;
    id: string;
    slug: string;
  }>();

  const { data: comments } = useQuery({
    queryKey: ["quiblet", name, "quib", id, slug, "comments"],
    queryFn: () => getComments(name, id, slug),
  });

  if (!comments) return null;
  return (
    <div>
      {buildTree(comments).map((comment) => (
        <CommentBlock key={comment.id} {...comment} />
      ))}
    </div>
  );
}
