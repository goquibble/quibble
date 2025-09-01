import QuibCard from "@/components/quib-card";
import QuibHeader from "@/components/quib-header/quib-header";
import RecentQuibs from "@/components/recent-quibs";

export default function Home() {
  return (
    <>
      <div className="flex flex-1 flex-col p-4">
        <QuibHeader />
        <QuibCard />
      </div>
      <RecentQuibs />
    </>
  );
}
