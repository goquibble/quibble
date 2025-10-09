"use client";
import { useQuery } from "@tanstack/react-query";
import { getFeed } from "@/services/feed";
import QuibCard from "./quib-card/quib-card";

export default function Feed() {
  const { data } = useQuery({
    queryKey: ["feed"],
    queryFn: () => getFeed(),
  });

  if (!data) return "Nothing found!";
  return data.items.map((quib) => <QuibCard key={quib.id} {...quib} />);
}
