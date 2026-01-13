import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import QuibletLayout from "@/components/layouts/quiblet-layout";
import Quib from "@/components/quib";
import { getQuibSSR } from "@/services/quib.server";
import { getQuibletSSR } from "@/services/quiblet.server";

export default async function QuibPage({
  params,
}: PageProps<"/q/[name]/quib/[id]/[slug]">) {
  const { name, id, slug } = await params;
  // prefetch data
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["quiblet", name],
      queryFn: () => getQuibletSSR(name),
    }),
    queryClient.prefetchQuery({
      queryKey: ["quiblet", name, "quib", id, slug],
      queryFn: () => getQuibSSR(name, id, slug),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QuibletLayout>
        <Quib />
      </QuibletLayout>
    </HydrationBoundary>
  );
}
