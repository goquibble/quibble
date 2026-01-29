"use client";

import { useQuery } from "@tanstack/react-query";
import { getQuibVote } from "@/services/quib";
import { useAuthStore } from "@/stores/auth";
import QuibActions from "../quib-actions";
import { Skeleton } from "../ui/skeleton";

interface QuibVoteProps {
  name: string;
  id: string;
  slug: string;
  upvotes: number;
  downvotes: number;
  comments_count: number;
  className?: string;
  showMoreBtn?: boolean;
}

export default function QuibVote({
  name,
  id,
  slug,
  upvotes: initialUpvotes,
  downvotes: initialDownvotes,
  comments_count,
  className,
  showMoreBtn,
}: QuibVoteProps) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthStore();

  const { data: user_vote_value, isLoading: isQuibLoading } = useQuery({
    queryKey: ["quib-vote", name, id, slug],
    queryFn: () => getQuibVote(name, id, slug),
    enabled: isAuthenticated,
  });

  if (isAuthLoading || (isAuthenticated && isQuibLoading)) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="mt-2 h-8 w-36" />
        <Skeleton className="mt-2 h-8 w-18" />
      </div>
    );
  }

  // Use a key to force re-render when auth state or vote value changes to ensure
  // QuibActions initializes its state correctly.
  const key = isAuthenticated ? `auth-${user_vote_value}` : "guest";

  return (
    <QuibActions
      key={key}
      name={name}
      id={id}
      slug={slug}
      upvotes={initialUpvotes}
      downvotes={initialDownvotes}
      user_vote_value={user_vote_value ?? 0}
      comments_count={comments_count}
      showMoreBtn={showMoreBtn}
      className={className}
    />
  );
}
