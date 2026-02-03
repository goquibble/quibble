"use client";
import { History } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth";
import { useRecentStore } from "@/stores/recent";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

export default function RecentQuibs() {
  const { userProfile } = useAuthStore();
  const { getRecentQuibs, clearRecentQuibs } = useRecentStore();

  if (!userProfile) return null;

  const recentQuibs = getRecentQuibs(userProfile.username);

  return (
    <aside className="sticky top-14 flex h-[calc(100vh-var(--spacing)*14)] w-75 flex-col gap-4 p-4 pl-2">
      <div className="flex items-center justify-between gap-2">
        <h4 className="font-medium text-secondary">Recent Quibs</h4>
        <Button
          size={"sm"}
          variant={"ghost"}
          onClick={() => clearRecentQuibs(userProfile.username)}
          disabled={recentQuibs.length === 0}
        >
          Clear
        </Button>
      </div>
      {recentQuibs.length === 0 ? (
        <div className="flex flex-col items-center text-center text-muted-foreground text-sm">
          <History className="size-8 stroke-1" />
          <p className="mt-2">No recent items found.</p>
          <p>Start exploring to see your history!</p>
        </div>
      ) : (
        recentQuibs.map((quib) => (
          <div key={quib.id} className="flex justify-between gap-2">
            <div className="flex flex-col">
              <Link
                href={`/q/${quib.quiblet.name}`}
                className="flex flex-1 items-center gap-2 hover:text-primary"
              >
                <Avatar className="size-6">
                  <AvatarImage src={quib.quiblet.avatar} />
                  <AvatarFallback seed={quib.quiblet.name} />
                </Avatar>
                <span className="font-semibold text-sm">
                  q/{quib.quiblet.name}
                </span>
              </Link>
              <Link
                href={`/q/${quib.quiblet.name}/quib/${quib.id}/${quib.slug}`}
                className="mt-2 line-clamp-2 font-semibold decoration-primary hover:underline"
              >
                {quib.title}
              </Link>
              <span className="text-secondary text-xs">
                {quib.upvotes} upvotes — {quib.comments} comments
              </span>
            </div>
            {quib.cover && (
              <div
                className="relative shrink-0"
                style={{ width: 75, height: 75 }}
              >
                <Image
                  src={quib.cover}
                  alt={quib.title}
                  fill={true}
                  className="rounded-md object-cover"
                  sizes="75px"
                />
              </div>
            )}
          </div>
        ))
      )}
    </aside>
  );
}
