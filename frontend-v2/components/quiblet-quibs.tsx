"use client";
import { useQuery } from "@tanstack/react-query";
import { getQuibletQuibs } from "@/services/quiblet";
import QuibCard from "./quib-card/quib-card";

interface QuibletQuibsProps {
  name: string;
}

export default function QuibletQuibs({ name }: QuibletQuibsProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["quiblet", name, "quibs"],
    queryFn: () => getQuibletQuibs(name),
  });

  if (isLoading) return "Loading...";
  if (!data) return null;

  return data.map((quib) => <QuibCard key={quib.id} {...quib} />);
}
