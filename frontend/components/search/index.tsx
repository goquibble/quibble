"use client";

import {
  ArrowUp,
  Code,
  Gamepad2,
  Info,
  Lightbulb,
  Loader2,
  SearchX,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import { Skeleton } from "../ui/skeleton";
import { Textarea } from "../ui/textarea";
import { ResultItem, type SearchResult } from "./result-item";

interface SearchResponse {
  results: SearchResult[];
  similar_items: SearchResult[];
}

const suggestions = [
  {
    icon: <Code className="size-4 text-secondary" />,
    text: "Why is Rust considered the future of systems programming?",
    category: "programming",
  },
  {
    icon: <Gamepad2 className="size-4 text-primary" />,
    text: "What are the best indie games right now?",
    category: "gaming",
  },
  {
    icon: <Lightbulb className="size-4 text-chart-3" />,
    text: "How does the trolley problem apply to autonomous vehicles?",
    category: "philosophy",
  },
  {
    icon: <Code className="size-4 text-secondary" />,
    text: "Is HTMX replacing single page applications?",
    category: "programming",
  },
  {
    icon: <Gamepad2 className="size-4 text-primary" />,
    text: "Is cloud gaming finally viable in 2026?",
    category: "gaming",
  },
  {
    icon: <Lightbulb className="size-4 text-chart-3" />,
    text: "Stoicism applied to software engineering",
    category: "philosophy",
  },
];

export default function SearchContent() {
  const userProfile = useAuthStore((state) => state.userProfile);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [similarItems, setSimilarItems] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
    inputRef.current?.focus();
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-6 p-4 pb-16">
      {/* Hero section — only before searching */}
      {!hasSearched && (
        <div className="mt-16 flex flex-col items-center gap-1 text-center sm:mt-24">
          <div className="mb-2 flex items-center gap-2.5">
            <div className="rounded-xl bg-primary/10 p-2">
              <WandSparkles className="size-5 text-primary" />
            </div>
            <span className="text-lg text-muted-foreground">
              Hi{" "}
              <span className="font-semibold text-foreground capitalize">
                {userProfile?.username || "there"}
              </span>
            </span>
          </div>
          <h1 className="font-bold text-2xl tracking-tight sm:text-3xl">
            What would you like to discover?
          </h1>
          <p className="mt-1 max-w-md text-muted-foreground text-sm">
            Ask anything - our AI will search across all quiblets to find the
            most relevant discussions.
          </p>
        </div>
      )}

      {/* Search input area */}
      <div className="relative w-full">
        <Textarea
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          rows={2}
          className="scrollbar-hide rounded-xl pr-12 text-base!"
        />
        <Button
          size="icon"
          className="absolute right-2 bottom-2 rounded-lg"
          disabled={!query.trim() || isLoading}
          onClick={handleSearch}
        >
          <span className="sr-only">Search</span>
          {isLoading ? <Loader2 className="animate-spin" /> : <ArrowUp />}
        </Button>
      </div>

      {!hasSearched && (
        <p className="mt-2 text-center text-muted-foreground text-xs">
          Powered by AI semantic search · Results may vary
        </p>
      )}

      {/* Suggestion chips — only before searching */}
      {!hasSearched && (
        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.text}
              type="button"
              className="flex items-center gap-2 rounded-xl border bg-card p-2 text-left text-muted-foreground text-sm transition-all hover:border-secondary/25 hover:bg-muted/50 hover:text-foreground"
              onClick={() => handleSuggestionClick(suggestion.text)}
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                {suggestion.icon}
              </span>
              <span className="line-clamp-2 leading-snug">
                {suggestion.text}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Results section */}
      {hasSearched && (
        <div className="flex w-full flex-col gap-8 pb-10">
          {isLoading ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 px-1 text-muted-foreground text-sm">
                <Sparkles className="size-4 animate-pulse text-primary" />
                <span>Searching across quiblets...</span>
              </div>
              {[...Array(3)].map((_, i) => (
                <Skeleton
                  key={i.toString()}
                  className="h-28 w-full animate-pulse rounded-xl bg-muted/40"
                  style={{
                    animationDelay: `${i * 150}ms`,
                    opacity: 1 - i * 0.2,
                  }}
                />
              ))}
            </div>
          ) : results.length > 0 || similarItems.length > 0 ? (
            <>
              {/* Top matches */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 px-1">
                  <Sparkles className="size-4 text-primary" />
                  <span className="font-semibold text-foreground text-sm">
                    Top Matches
                  </span>
                  {results.length > 0 && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs">
                      {results.length}
                    </span>
                  )}
                </div>
                {results.length > 0 ? (
                  results.map((result) => (
                    <ResultItem key={result.id} result={result} />
                  ))
                ) : (
                  <Alert>
                    <SearchX />
                    <AlertTitle>No high-confidence matches found</AlertTitle>
                    <AlertDescription>
                      We couldn&apos;t find any direct matches for your query.
                      Check out the recommended items below.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Recommended */}
              {similarItems.length > 0 && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 px-1">
                    <Lightbulb className="size-4 text-chart-3" />
                    <span className="font-semibold text-foreground text-sm">
                      Recommended
                    </span>
                    <span className="rounded-full bg-chart-3/10 px-2 py-0.5 font-medium text-chart-3 text-xs">
                      {similarItems.length}
                    </span>
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

              {/* Info footer */}
              <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4">
                <div className="rounded-full bg-muted p-1.5">
                  <Info className="size-3.5 text-muted-foreground" />
                </div>
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-foreground">How this works</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    This semantic search uses AI to understand the meaning
                    behind your query, not just keywords. Results improve as the
                    community grows. AI-generated results may not always be 100%
                    accurate.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="rounded-2xl bg-muted/50 p-4">
                <SearchX className="size-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-foreground">No results found</p>
                <p className="text-muted-foreground text-sm">
                  Try rephrasing your question or search for a different topic.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  setHasSearched(false);
                  setQuery("");
                  inputRef.current?.focus();
                }}
              >
                <Sparkles className="size-3.5" />
                Try a new search
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
