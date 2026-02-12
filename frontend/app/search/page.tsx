"use client";

import { ArrowUp, Sparkles, WandSparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MarkdownViewer } from "@/components/ui/markdown-viewer";
import api from "@/lib/api";
import { cn, timeAgo } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth";

interface SearchResult {
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

interface SearchResponse {
  results: SearchResult[];
  similar_items: SearchResult[];
}

const ResultItem = ({
  result,
  truncateContent,
}: {
  result: SearchResult;
  truncateContent?: boolean;
}) => (
  <Link
    href={`/q/${result.quiblet.name}/quib/${result.id}/${result.slug}`}
    className="group flex flex-col gap-3 rounded-xl border bg-card p-4 hover:bg-muted/50 sm:flex-row sm:items-start"
  >
    {/* Cover Image (if available) */}
    {result.cover && (
      <div className="relative aspect-video h-24 w-full shrink-0 overflow-hidden rounded-lg sm:aspect-square sm:w-24">
        <Image
          src={result.cover}
          alt={result.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>
    )}

    <div className="flex flex-1 flex-col justify-between gap-2">
      <div className="flex flex-col gap-1">
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
          <span className="font-medium text-foreground text-sm">
            {result.quiblet.name}
          </span>
          <span>{timeAgo(result.created_at)}</span>
        </div>
        <h3 className="font-bold text-lg leading-tight group-hover:text-primary">
          {result.title}
        </h3>
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

export default function SearchPage() {
  const userProfile = useAuthStore((state) => state.userProfile);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [similarItems, setSimilarItems] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const suggestions = [
    {
      icon: <Sparkles className="size-4" />,
      text: "What are the latest developments in AI?",
    },
    {
      icon: <Sparkles className="size-4" />,
      text: "Find posts about retro gaming consoles",
    },
    {
      icon: <Sparkles className="size-4" />,
      text: "Explain the plot of Inception",
    },
  ];

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    setResults([]);
    setSimilarItems([]);

    try {
      const { data } = await api.get<SearchResponse>("/api/v1/ai/search", {
        params: { q: query },
      });
      setResults(data.results);
      setSimilarItems(data.similar_items);
    } catch (error) {
      console.error(error);
      toast.error("Failed to perform search. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleSuggestionClick = (text: string) => {
    setQuery(text);
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-4 p-4">
      {!hasSearched && (
        <div className="mt-20 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 self-start">
            <WandSparkles className="size-6 text-purple-500" />
            <span className="text-2xl capitalize">
              Hi {userProfile?.username || "there"}!
            </span>
          </div>
          <h1 className="font-semibold text-2xl tracking-tight md:text-3xl">
            How can I help you find?
          </h1>
        </div>
      )}

      {/* Input Area */}
      <div className="sticky top-4 z-10 w-full space-y-2 bg-background/80 pb-2 backdrop-blur-sm">
        <div className="relative">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search anything..."
            className="h-14 w-full rounded-full pr-16 pl-6 font-medium text-base! shadow-sm ring-purple-500!"
          />
          <Button
            size="icon"
            className="absolute top-2 right-2 size-10 rounded-full bg-purple-500 text-white hover:bg-purple-500/90"
            disabled={!query.trim() || isLoading}
            onClick={handleSearch}
          >
            <ArrowUp className="size-5" />
            <span className="sr-only">Send</span>
          </Button>
        </div>

        {!hasSearched && (
          <div className="text-center text-muted-foreground text-xs">
            AI semantic search can make mistakes.
          </div>
        )}
      </div>

      {/* Suggestions (only show if request hasn't been made yet) */}
      {!hasSearched && (
        <div className="flex w-full flex-wrap justify-center gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              // biome-ignore lint/suspicious/noArrayIndexKey: suggestions are static
              key={index}
              type="button"
              className="flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-muted-foreground text-sm hover:bg-muted/50 hover:text-foreground"
              onClick={() => handleSuggestionClick(suggestion.text)}
            >
              {suggestion.icon}
              <span className="max-w-[200px] truncate sm:max-w-none">
                {suggestion.text}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Results List */}
      {hasSearched && (
        <div className="flex w-full flex-col gap-8 pb-10">
          {isLoading ? (
            <div className="flex flex-col gap-4">
              {[...Array(3)].map((_, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: suggestions are static
                  key={i}
                  className="h-24 w-full animate-pulse rounded-xl bg-muted/50"
                  style={{ opacity: 1 - i * 0.25 }}
                />
              ))}
            </div>
          ) : results.length > 0 || similarItems.length > 0 ? (
            <>
              {results.length > 0 && (
                <div className="flex flex-col gap-4">
                  <div className="px-4 text-muted-foreground">Top Matches</div>
                  {results.map((result) => (
                    <ResultItem key={result.id} result={result} />
                  ))}
                </div>
              )}

              {similarItems.length > 0 && (
                <div className="flex flex-col gap-4">
                  <div className="px-4 text-muted-foreground">
                    Similar Items
                  </div>
                  {similarItems.map((result) => (
                    <ResultItem
                      key={result.id}
                      result={result}
                      truncateContent
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground">
              <Sparkles className="size-8 opacity-20" />
              <p>No results found specifically matching your query.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
