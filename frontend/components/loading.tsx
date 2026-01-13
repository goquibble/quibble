import { cn } from "@/lib/utils";
import { Spinner } from "./ui/spinner";

interface LoadingProps {
  className?: string;
}

export default function Loading({ className }: LoadingProps) {
  return (
    <div className={cn("mx-auto flex flex-col items-center gap-2", className)}>
      <Spinner variant="bars" className="text-primary" />
      <span className="font-medium text-sm">Loading...</span>
    </div>
  );
}
