"use client";
import { useQuery } from "@tanstack/react-query";
import { getQuibletQuibs } from "@/services/quiblet";
import { useAuthStore } from "@/stores/auth";
import QuibCard from "./quib-card";
import QuibHeader from "./quib-header";
import QuibSkeleton from "./quib-skeleton";
import Quibs404 from "./quibs-404";

interface QuibletQuibsProps {
  name: string;
}

export default function QuibletQuibs({ name }: QuibletQuibsProps) {
  const isLoadingAuth = useAuthStore((state) => state.isLoading);
  const { data, isLoading } = useQuery({
    queryKey: ["quiblet", name, "quibs"],
    queryFn: () => getQuibletQuibs(name),
    enabled: !isLoadingAuth,
  });

  if (isLoading || isLoadingAuth) {
    return (
      <div className="mt-2 flex flex-col gap-4">
        <QuibHeader />
        {[...Array(2)].map((_, i) => (
          <QuibSkeleton
            key={String(i)}
            mediaClassName={i === 1 ? "aspect-video" : "h-30"}
          />
        ))}
      </div>
    );
  }

  if (!data || !data.length) return <Quibs404 name={name} className="mt-2" />;

  return (
    <div className="mt-2 flex flex-col gap-4">
      <QuibHeader />
      {data.map((quib) => (
        <QuibCard key={quib.id} {...quib} />
      ))}
    </div>
  );
}
