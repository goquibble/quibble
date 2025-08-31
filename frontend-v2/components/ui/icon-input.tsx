import type { LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

interface IconInputProps extends React.ComponentProps<"input"> {
  wrapperClassName?: string;
  iconClassName?: string;
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}

function IconInput({
  wrapperClassName,
  iconClassName,
  Icon,
  className,
  ...props
}: IconInputProps) {
  return (
    <div className={cn("relative flex w-full items-center", wrapperClassName)}>
      <Icon
        className={cn(
          "absolute left-3 size-5 text-muted-foreground",
          iconClassName,
        )}
      />
      <Input className={cn("pl-10", className)} {...props} />
    </div>
  );
}

export default IconInput;
