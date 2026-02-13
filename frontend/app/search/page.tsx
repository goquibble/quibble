import type { Metadata } from "next";
import SearchContent from "@/components/search";

export const metadata: Metadata = {
  title: "AI Search",
  description:
    "Unlock the power of AI with Quibble's semantic search. Find posts, users, and conversations using natural language queries that understand meaning beyond just keywords.",
};

export default function SearchPage() {
  return <SearchContent />;
}
