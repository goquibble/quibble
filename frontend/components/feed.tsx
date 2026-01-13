"use client";
import { useQuery } from "@tanstack/react-query";
import { getFeed } from "@/services/feed";
import QuibCard from "./quib-card";
import QuibHeader from "./quib-header";
import Quibs404 from "./quibs-404";

export default function Feed() {
  const { data } = useQuery({
    queryKey: ["feed"],
    queryFn: () => getFeed(),
  });

  if (!data) return <Quibs404 className="mt-4 flex-1" />;
  return (
    <div className="flex flex-1 flex-col p-4 pr-2">
      <QuibHeader />
      {data.items.map((quib) => (
        <QuibCard key={quib.id} {...quib} />
      ))}
    </div>
  );
}
