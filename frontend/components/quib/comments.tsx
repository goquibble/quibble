import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { buildTree } from "@/lib/build-tree";
import { getComments } from "@/services/comment";
import { useAuthStore } from "@/stores/auth";
import Loading from "../loading";
import CommentBlock from "./comment-block";
import Comments404 from "./comments-404";

export default function Comments() {
  const isAuthLoading = useAuthStore((state) => state.isLoading);

  const { name, id, slug } = useParams<{
    name: string;
    id: string;
    slug: string;
  }>();

  const { data: comments, isLoading } = useQuery({
    queryKey: ["quiblet", name, "quib", id, slug, "comments"],
    queryFn: () => getComments(name, id, slug),
    enabled: !isAuthLoading,
  });

  if (isAuthLoading || isLoading) return <Loading />;
  if (!comments) return <Comments404 />;

  return (
    <div className="flex flex-col gap-2">
      {buildTree(comments).map((comment) => (
        <CommentBlock
          key={comment.id}
          {...comment}
          quiblet_name={name}
          quib_id={id}
          quib_slug={slug}
        />
      ))}
    </div>
  );
}
