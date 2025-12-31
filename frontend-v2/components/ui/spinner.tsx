// https://www.shadcn.io/components/interactive/spinner
import { LoaderCircle, type LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

type SpinnerVariantProps = Omit<SpinnerProps, "variant">;
export type SpinnerProps = LucideProps & {
  variant?: "default" | "bars";
};

const Default = ({ className, ...props }: SpinnerVariantProps) => (
  <LoaderCircle className={cn("animate-spin", className)} {...props} />
);

const Bars = ({ size = 24, ...props }: SpinnerVariantProps) => (
  <svg
    height={size}
    viewBox="0 0 24 24"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>Loading...</title>
    <style>{`
      .spinner-bar {
        animation: spinner-bars-animation .8s linear infinite;
        animation-delay: -.8s;
      }
      .spinner-bars-2 {
        animation-delay: -.65s;
      }
      .spinner-bars-3 {
        animation-delay: -0.5s;
      }
      @keyframes spinner-bars-animation {
        0% {
          y: 1px;
          height: 22px;
        }
        93.75% {
          y: 5px;
          height: 14px;
          opacity: 0.2;
        }
      }
    `}</style>
    <rect
      className="spinner-bar"
      fill="currentColor"
      height="22"
      width="6"
      x="1"
      y="1"
    />
    <rect
      className="spinner-bar spinner-bars-2"
      fill="currentColor"
      height="22"
      width="6"
      x="9"
      y="1"
    />
    <rect
      className="spinner-bar spinner-bars-3"
      fill="currentColor"
      height="22"
      width="6"
      x="17"
      y="1"
    />
  </svg>
);

export const Spinner = ({ variant, ...props }: SpinnerProps) => {
  switch (variant) {
    case "bars":
      return <Bars {...props} />;
    default:
      return <Default {...props} />;
  }
};
