import { ChevronDown, Rows2, Rows3 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLayoutStore } from "@/stores/layout";
import { Button } from "../ui/button";

export default function QuibLayoutSelector() {
  const { layout, setLayout } = useLayoutStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"sm"} variant={"outline"}>
          {layout === "card" ? (
            <Rows2 className="mr-2 h-4 w-4 text-primary" />
          ) : (
            <Rows3 className="mr-2 h-4 w-4 text-primary" />
          )}
          <span className="capitalize">{layout}</span>
          <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLayout("card")}>
          <Rows2 className="mr-2 h-4 w-4" />
          Card
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLayout("compact")}>
          <Rows3 className="mr-2 h-4 w-4" />
          Compact
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
