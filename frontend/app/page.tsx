import Feed from "@/components/feed";
import RecentQuibs from "@/components/recent-quibs";

export default function Home() {
  return (
    <div className="mx-auto flex max-w-275 flex-1">
      <Feed />
      <RecentQuibs />
    </div>
  );
}
