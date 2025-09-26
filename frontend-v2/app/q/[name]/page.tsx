import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import Quiblet from "@/components/quiblet";
import { getQuiblet } from "@/services/quiblet";

export async function generateMetadata({
  params,
}: PageProps<"/q/[name]">): Promise<Metadata> {
  const { name } = await params;

  return {
    title: `q/${name}`,
  };
}

export default async function QuibletPage({ params }: PageProps<"/q/[name]">) {
  const { name } = await params;
  // prefetch data
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["quiblet", name],
    queryFn: () => getQuiblet(name),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Quiblet name={name} />
    </HydrationBoundary>
  );
}
