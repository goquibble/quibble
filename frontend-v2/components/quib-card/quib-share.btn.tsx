"use client";
import { Link, Share2, Split } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function QuibShareBtn() {
  const handleCopyLink = () => {
    toast.success("Link copied!");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"sm"} variant={"outline"} className="relative">
          <Share2 />
          <span className="font-medium text-sm">Share</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="bottom">
        <DropdownMenuItem onClick={handleCopyLink}>
          <Link />
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Split className="rotate-90" />
          Crossquib
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
