import { Book, CakeSlice, Globe } from "lucide-react";
import { Button } from "./ui/button";

export default function QuibletInfo() {
  return (
    <aside className="flex h-[calc(100vh-var(--spacing)*14)] w-75 flex-col gap-4 p-4 pl-2">
      <div className="flex flex-col gap-1">
        <span className="font-bold">q/headcn</span>
        <p className="font-medium text-muted-foreground text-sm">
          A wholesome community made by & for software & tech folks. Have a
          doubt? Ask it out.
        </p>
        <div className="flex items-center gap-2 text-muted-foreground">
          <CakeSlice className="size-4" />
          <span className="text-sm">Created Jan 21, 2020</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Globe className="size-4" />
          <span className="text-sm">Public</span>
        </div>
      </div>
      <Button variant={"outline"} size={"sm"}>
        <Book />
        Quiblet Guide
      </Button>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="font-bold text-sm">1.25K</span>
          <span className="text-muted-foreground text-sm">Members</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm">256</span>
          <span className="text-muted-foreground text-sm">Quibs</span>
        </div>
      </div>
    </aside>
  );
}
