import Feed from "@/components/feed";
import LegalLinks from "@/components/legal-links";
import RecentQuibs from "@/components/recent-quibs";

export default function Home() {
  return (
    <div className="mx-auto flex max-w-275 flex-1">
      <Feed />
      <div>
        <div className="sticky top-14 flex h-[calc(100vh-var(--spacing)*14)] w-75 flex-col gap-4 p-4 pl-2">
          <RecentQuibs />
          <LegalLinks />
        </div>
      </div>
    </div>
  );
}
