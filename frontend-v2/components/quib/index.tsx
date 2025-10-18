"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getQuib } from "@/services/quib";

export default function Quib() {
  const { name, id, slug } = useParams<{
    name: string;
    id: string;
    slug: string;
  }>();

  const { data: quib } = useQuery({
    queryKey: ["quiblet", name, "quib", id, slug],
    queryFn: () => getQuib(name, id, slug),
  });

  if (!quib) return null;
  return quib.title;
}
