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

interface QuibShareBtnProps {
  id: string;
  slug: string;
  quiblet_name: string;
}

export default function QuibShareBtn({
  id,
  slug,
  quiblet_name,
}: QuibShareBtnProps) {
  const handleCopyLink = () => {
    const link = `${window.location.origin}/q/${quiblet_name}/quib/${id}/${slug}`;
    window.navigator.clipboard
      .writeText(link)
      .then(() => toast.success("Link copied!"))
      .catch(() => toast.error("Oops! Something went wrong."));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"sm"} variant={"outline"} className="relative z-5">
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
