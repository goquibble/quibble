"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { buildTree } from "@/lib/build-tree";
import { getComments } from "@/services/comment";
import Loading from "../loading";
import CommentBlock from "./comment-block";
import Comments404 from "./comments-404";

export default function Comments() {
  const { name, id, slug } = useParams<{
    name: string;
    id: string;
    slug: string;
  }>();

  const { data: comments, isLoading } = useQuery({
    queryKey: ["quiblet", name, "quib", id, slug, "comments"],
    queryFn: () => getComments(name, id, slug),
  });

  if (isLoading) return <Loading />;
  if (!comments) return <Comments404 />;

  return (
    <div className="flex flex-col gap-2">
      {buildTree(comments).map((comment) => (
        <CommentBlock key={comment.id} {...comment} />
      ))}
    </div>
  );
}
