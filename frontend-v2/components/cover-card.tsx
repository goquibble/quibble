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
        "relative overflow-hidden rounded-lg bg-center bg-cover bg-no-repeat",
        className,
      )}
    >
      <div className="absolute inset-0 z-1 bg-background/50 backdrop-blur-md"></div>
      <div className="pointer-events-none absolute inset-0 z-3 rounded-lg border border-foreground/15"></div>
      <Image
        src={cover ?? ""}
        alt={`cover-${cover}`}
        className="z-2 object-contain"
        fill={true}
      />
    </div>
  );
}
