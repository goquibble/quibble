import type { Metadata } from "next";
import QuibCard from "@/components/quib-card";
import QuibHeader from "@/components/quib-header/quib-header";
import RecentQuibs from "@/components/recent-quibs";

export const metadata: Metadata = {
  title: "Quibble - Delve into real conversations.",
  description:
    "A respectful social platform for real conversations. Celebrate diversity, connect authentically, and join Quibble’s ad-free community.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function Home() {
  return (
    <div className="mx-auto flex max-w-300 flex-1">
      <div className="flex flex-1 flex-col p-4 pr-2">
        <QuibHeader />
        <QuibCard />
      </div>
      <RecentQuibs />
    </div>
  );
}
