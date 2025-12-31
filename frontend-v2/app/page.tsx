import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Feed from "@/components/feed";
import RecentQuibs from "@/components/recent-quibs";
import { getFeedSSR } from "@/services/feed.server";

export default async function Home() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["feed"],
    queryFn: () => getFeedSSR(),
  });

  return (
    <div className="mx-auto flex max-w-300 flex-1">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Feed />
      </HydrationBoundary>
      <RecentQuibs />
    </div>
  );
}
