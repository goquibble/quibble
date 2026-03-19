import { Filter } from "lucide-react";
import IconInput from "../ui/icon-input";
import CreateQuibletBtn from "./create-quiblet-btn";
import RecentQuiblets from "./recent-quiblets";
import Resources from "./resources";
import YourQuiblets from "./your-quiblets";

export default function AppSidebar() {
  return (
    <aside className="scrollbar-track-rounded-full scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent scrollbar scrollbar-thumb-rounded-full sticky top-14 flex h-[calc(100vh-var(--spacing)*14)] w-75 flex-col gap-4 overflow-y-auto border-r p-4">
      <div className="flex flex-col gap-2">
        <IconInput
          Icon={Filter}
          placeholder="Search filter..."
          iconClassName="size-4"
          className="h-8 pl-9"
          disabled
        />
        <CreateQuibletBtn />
      </div>
      <div className="flex flex-col gap-2">
        <RecentQuiblets />
        <YourQuiblets />
        <Resources />
      </div>
      <span className="mx-auto mt-auto text-secondary text-xs">
        Quibble &copy; {new Date().getFullYear()}. All rights reserved.
      </span>
    </aside>
  );
}
