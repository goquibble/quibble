import Image from "next/image";
import Link from "next/link";
import { MarkdownViewer } from "@/components/ui/markdown-viewer";
import { cn, timeAgo } from "@/lib/utils";

export interface SearchResult {
  id: string;
  slug: string;
  title: string;
  cover?: string | null;
  content?: string | null;
  created_at: string;
  quiblet: {
    id: string;
    name: string;
    avatar_url?: string | null;
  };
}

export const ResultItem = ({
  result,
  truncateContent,
}: {
  result: SearchResult;
  truncateContent?: boolean;
}) => (
  <Link
    href={`/q/${result.quiblet.name}/quib/${result.id}/${result.slug}`}
    className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:bg-muted/50 hover:shadow-sm sm:flex-row sm:items-start"
  >
    {/* Cover Image (if available) */}
    {result.cover && (
      <div className="relative aspect-video h-24 w-full shrink-0 overflow-hidden rounded-lg sm:aspect-square sm:w-24">
        <Image
          src={result.cover}
          alt={result.title}
          fill
          className="object-cover"
        />
      </div>
    )}

    <div className="flex flex-1 flex-col justify-between gap-2">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-muted-foreground text-xs">
          {result.quiblet.avatar_url && (
            <Image
              src={result.quiblet.avatar_url}
              alt={result.quiblet.name}
              width={16}
              height={16}
              className="rounded-full"
            />
          )}
          <span className="font-semibold text-primary text-sm">
            q/{result.quiblet.name}
          </span>
          <span>{timeAgo(result.created_at)}</span>
        </div>
        <h3 className="font-bold text-base leading-snug">{result.title}</h3>
      </div>

      {result.content && (
        <MarkdownViewer
          content={result.content}
          className={cn(
            "text-muted-foreground text-sm",
            truncateContent && "line-clamp-2",
          )}
        />
      )}
    </div>
  </Link>
);
