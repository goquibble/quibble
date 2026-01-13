import { cn } from "@/lib/utils";

interface Quibs404 {
  name?: string;
  className?: string;
}

export default function Quibs404({ name, className }: Quibs404) {
  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <span className="font-bold text-primary text-xl">OoPs!</span>
      <span className="font-medium text-sm">
        No Quibs Found{name && ` — q/${name}`}
      </span>
    </div>
  );
}
