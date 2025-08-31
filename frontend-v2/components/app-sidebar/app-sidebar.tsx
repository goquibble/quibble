import { Filter, PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import IconInput from "../ui/icon-input";
import Misc from "./misc";
import RecentQuiblets from "./recent-quiblets";
import YourQuiblets from "./your-quiblets";

export default function AppSidebar() {
  return (
    <aside className="flex h-[calc(100vh-var(--spacing)*14)] w-75 flex-col gap-4 border-r p-4">
      <div className="flex flex-col gap-2">
        <IconInput
          Icon={Filter}
          placeholder="Search filter..."
          iconClassName="size-4"
          className="h-8 pl-9"
          disabled
        />
        <Button size={"sm"} variant={"outline"}>
          <PlusCircle className="size-4" />
          Create Quiblet
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <RecentQuiblets />
        <YourQuiblets />
        <Misc />
      </div>
      <span className="mx-auto text-secondary text-xs">
        Quibble &copy; {new Date().getFullYear()}. All rights reserved.
      </span>
    </aside>
  );
}
