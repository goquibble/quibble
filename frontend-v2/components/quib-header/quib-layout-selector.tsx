import { ChevronDown, Rows2, Rows3 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";

export default function QuibLayoutSelector() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"sm"} variant={"outline"}>
          <Rows2 className="text-primary" />
          <span>Card</span>
          <ChevronDown className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Rows2 />
          Card
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Rows3 />
          Compact
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
