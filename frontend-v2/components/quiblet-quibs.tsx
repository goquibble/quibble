"use client";
import { useQuery } from "@tanstack/react-query";
import { getQuibletQuibs } from "@/services/quiblet";
import Loading from "./loading";
import QuibCard from "./quib-card/quib-card";
import QuibHeader from "./quib-header/quib-header";
import Quibs404 from "./quibs-404";

interface QuibletQuibsProps {
  name: string;
}

export default function QuibletQuibs({ name }: QuibletQuibsProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["quiblet", name, "quibs"],
    queryFn: () => getQuibletQuibs(name),
  });

  if (isLoading) return <Loading />;
  if (!data || !data.length) return <Quibs404 name={name} className="mt-2" />;

  return (
    <div className="mt-2">
      <QuibHeader />
      {data.map((quib) => (
        <QuibCard key={quib.id} {...quib} />
      ))}
    </div>
  );
}
