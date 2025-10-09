"use client";
import { useQuery } from "@tanstack/react-query";
import { getQuibletQuibs } from "@/services/quiblet";
import Loading from "./loading";
import QuibCard from "./quib-card/quib-card";
import QuibHeader from "./quib-header/quib-header";

interface QuibletQuibsProps {
  name: string;
}

export default function QuibletQuibs({ name }: QuibletQuibsProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["quiblet", name, "quibs"],
    queryFn: () => getQuibletQuibs(name),
  });

  if (isLoading) return <Loading />;
  if (!data || !data.length)
    return (
      <div className="flex flex-col items-center justify-center gap-1">
        <span className="font-bold text-primary text-xl">OoPs!</span>
        <span className="font-medium text-sm">No Quibs Found — q/{name}</span>
      </div>
    );

  return (
    <div className="mt-2">
      <QuibHeader />
      {data.map((quib) => (
        <QuibCard key={quib.id} {...quib} />
      ))}
    </div>
  );
}
