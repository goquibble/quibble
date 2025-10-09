import Image from "next/image";
import Link from "next/link";
import { timeAgo } from "@/lib/utils";
import type { Quib } from "@/types/quib";
import QuibActions from "./quib-actions";
import QuibSource from "./quib-source";

export default function QuibCard({
  upvotes,
  downvotes,
  user_vote_value,
  quiblet,
  poster,
  id,
  slug,
  title,
  cover,
  cover_small,
  content,
  created_at,
}: Quib) {
  return (
    <div className="group relative flex flex-col gap-2 rounded-lg border p-4 pb-2">
      <Link
        href={`/q/${quiblet.name}/quib/${id}/${slug}`}
        className="absolute inset-0"
      />
      <div className="flex items-center gap-2">
        <QuibSource quiblet={quiblet} poster={poster} />
        <span className="text-muted-foreground text-xs">
          — {timeAgo(created_at)}
        </span>
      </div>
      <h2 className="font-bold text-xl decoration-2 decoration-muted-foreground group-hover:underline dark:text-white/90">
        {title}
      </h2>
      {content ? (
        <p className="text-sm">{content}</p>
      ) : (
        <div
          className="relative aspect-video overflow-hidden rounded-lg bg-center bg-cover bg-no-repeat"
          style={{ backgroundImage: `url(${cover_small})` }}
        >
          <div className="absolute inset-0 z-1 bg-background/50 backdrop-blur-md"></div>
          <div className="pointer-events-none absolute inset-0 z-3 rounded-lg border border-foreground/15"></div>
          <Image
            src={cover ?? ""}
            alt={`cover-${slug}`}
            fill
            className="z-2 object-contain"
          />
        </div>
      )}
      <QuibActions
        id={id}
        slug={slug}
        upvotes={upvotes}
        downvotes={downvotes}
        user_vote_value={user_vote_value}
        quiblet_name={quiblet.name}
      />
    </div>
  );
}
