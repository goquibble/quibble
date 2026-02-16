"use client";

import { ArrowUp, SearchX, Sparkles, WandSparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import { ResultItem, type SearchResult } from "./result-item";

interface SearchResponse {
  results: SearchResult[];
  similar_items: SearchResult[];
}

export default function SearchContent() {
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
      <div className="w-full space-y-2">
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
              <div className="flex flex-col gap-4">
                <div className="px-4 text-muted-foreground">Top Matches</div>
                {results.length > 0 ? (
                  results.map((result) => (
                    <ResultItem key={result.id} result={result} />
                  ))
                ) : (
                  <Alert>
                    <SearchX />
                    <AlertTitle>No high-confidence matches found</AlertTitle>
                    <AlertDescription>
                      We couldn't find any direct matches for your query. Check
                      out the recommended items below.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {similarItems.length > 0 && (
                <div className="flex flex-col gap-4">
                  <div className="px-4 text-muted-foreground">Recommended</div>
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
              <p>
                I couldn't find any content semantically related to your
                request.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
