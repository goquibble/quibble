import Feed from "@/components/feed";
import LegalLinks from "@/components/legal-links";
import PopularQuiblets from "@/components/popular-quiblets";
import RecentQuibs from "@/components/recent-quibs";

export default function Home() {
  return (
    <div className="mx-auto flex max-w-275 flex-1">
      <Feed />
      <div>
        <div className="scrollbar-track-rounded-full scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent scrollbar scrollbar-thumb-rounded-full sticky top-14 flex h-[calc(100vh-var(--spacing)*14)] w-75 flex-col gap-4 overflow-y-auto p-4 pl-2">
          <RecentQuibs />
          <PopularQuiblets />
          <LegalLinks />
        </div>
      </div>
    </div>
  );
}
