import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Nullable } from "@/types/generics";

interface CoverCardProps {
  cover?: Nullable<string>;
  cover_small?: Nullable<string>;
  className?: string;
}

export function CoverCard({ cover, cover_small, className }: CoverCardProps) {
  return (
    <div
      style={{ backgroundImage: `url(${cover_small})` }}
      className={cn(
        "relative rounded-2xl bg-center bg-cover bg-no-repeat",
        className,
      )}
    >
      <div className="absolute inset-0 z-1 rounded-lg bg-background/75 backdrop-blur-xl"></div>
      <div className="pointer-events-none absolute inset-0 z-3 rounded-lg border border-foreground/15"></div>
      <Image
        src={cover ?? ""}
        alt={`cover-${cover}`}
        className="z-2 rounded-lg object-contain"
        fill={true}
        sizes="(max-width: 768px) 100vw, 500px"
      />
    </div>
  );
}
