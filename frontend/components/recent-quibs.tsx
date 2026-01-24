import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

const recentQuibs = [
  {
    id: 1,
    quiblet: {
      name: "headcn",
      avatar: "https://github.com/headcn.png",
    },
    title: "Why is work-from-home still so controversial?",
    cover: "/_mock/img-1.jpg",
    upvotes: 34,
    comments: 12,
  },
  {
    id: 2,
    quiblet: {
      name: "quibble",
      avatar: "https://github.com/quibblespace.png",
    },
    title: "Just finished my first side project!",
    cover: null,
    upvotes: 15,
    comments: 4,
  },
];

export default function RecentQuibs() {
  return (
    <aside className="sticky top-14 flex h-[calc(100vh-var(--spacing)*14)] w-75 flex-col gap-4 p-4 pl-2">
      <div className="flex items-center justify-between gap-2">
        <h4 className="font-medium text-secondary">Recent Quibs</h4>
        <Button size={"sm"} variant={"ghost"} disabled>
          Clear
        </Button>
      </div>
      {recentQuibs.map((quib) => (
        <div key={quib.id} className="flex gap-2">
          <div className="flex flex-col gap-2">
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
              href={`/q/${quib.quiblet.name}/${quib.id}`}
              className="font-semibold decoration-primary hover:underline"
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
      ))}
    </aside>
  );
}
