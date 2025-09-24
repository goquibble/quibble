import QuibCard from "@/components/quib-card";
import QuibHeader from "@/components/quib-header/quib-header";
import RecentQuibs from "@/components/recent-quibs";

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
