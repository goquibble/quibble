import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import QuibletLayout from "@/components/layouts/quiblet-layout";
import Quib from "@/components/quib";
import { getQuibSSR } from "@/services/quib.server";
import { getQuibletSSR } from "@/services/quiblet.server";

export async function generateMetadata({
  params,
}: PageProps<"/q/[name]/quib/[id]/[slug]">): Promise<Metadata> {
  const { name, id, slug } = await params;
  const quib = await getQuibSSR(name, id, slug);

  return {
    title: quib.title,
    description:
      quib.content?.slice(0, 160) || `Check out this quib from q/${name}`,
    openGraph: {
      images: quib.cover ? [quib.cover] : [],
    },
  };
}

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
