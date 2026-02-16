import type { Metadata } from "next";
import SearchContent from "@/components/search";

export const metadata: Metadata = {
  title: "Ask Quibble",
  description: "Ask Quibble anything and get answers from the AI.",
};

export default function SearchPage() {
  return <SearchContent />;
}
