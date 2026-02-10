import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Bookmark, Ellipsis, Flag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn, timeAgo } from "@/lib/utils";
import { deleteQuib } from "@/services/quib";
import { useAuthStore } from "@/stores/auth";
import type { Quib } from "@/types/quib";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type QuibMetaProps = Pick<
  Quib,
  "quiblet" | "poster" | "created_at" | "id" | "slug"
>;

export default function QuibMeta({
  quiblet,
  poster,
  created_at,
  id,
  slug,
}: QuibMetaProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const userProfile = useAuthStore((state) => state.userProfile);
  const isPoster = !!poster && userProfile?.id === poster.id;

  const handleDelete = () => {
    const promise = deleteQuib(quiblet.name, id, slug);
    toast.promise(promise, {
      loading: "Deleting quib...",
      success: () => {
        queryClient.setQueryData(
          ["quiblet", quiblet.name, "quibs"],
          (oldQuibs: Quib[] | undefined) => {
            if (!oldQuibs) return undefined;
            return oldQuibs.filter((q) => q.id !== id);
          },
        );
        router.push(`/q/${quiblet.name}`);
        return "Quib deleted";
      },
      error: "Failed to delete quib",
    });
  };

  return (
    <div className="flex gap-2">
      <Button
        size={"icon-sm"}
        variant={"outline"}
        onClick={() => router.back()}
      >
        <ArrowLeft />
      </Button>
      <Avatar>
        <AvatarImage src={quiblet.avatar_url ?? ""} />
        <AvatarFallback seed={quiblet.name} />
      </Avatar>
      <div className="flex flex-col gap-1 text-sm/none">
        <Link
          href={`/q/${quiblet.name}`}
          className="font-semibold hover:text-primary"
        >
          q/{quiblet.name}
        </Link>
        <Link
          href={`/u/${poster?.username}`}
          className={cn(
            "font-medium text-muted-foreground hover:underline",
            !poster && "pointer-events-none",
          )}
        >
          {poster?.username ?? "[deleted]"}
        </Link>
      </div>
      <span className="text-muted-foreground text-xs/none">
        — {timeAgo(created_at)}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon-sm" variant="ghost" className="ml-auto">
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled>
            <Bookmark />
            <span>Save</span>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Flag />
            <span>Report</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            disabled={!isPoster}
            onClick={handleDelete}
          >
            <Trash2 />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
