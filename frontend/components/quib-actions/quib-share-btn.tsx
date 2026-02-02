import { Link, Share2, Split } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
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
  className?: string;
  compact?: boolean;
}

export default function QuibShareBtn({
  id,
  slug,
  quiblet_name,
  className,
  compact,
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
        <Button
          size={compact ? "icon-sm" : "sm"}
          variant={"outline"}
          className={cn("relative z-5", className)}
        >
          <Share2 className={cn(compact && "h-4 w-4")} />
          {!compact && <span className="font-medium text-sm">Share</span>}
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
