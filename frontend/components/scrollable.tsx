"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface ScrollableProps {
  children: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
}

export default function Scrollable({
  children,
  className,
  wrapperClassName,
}: ScrollableProps) {
  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const [canScroll, setCanScroll] = useState({
    left: false,
    right: false,
  });

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollableRef.current;
    if (!container) return;

    const scrollAmount = container.offsetWidth;
    const newScrollLeft =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    // scrollll!!!
    container.scrollTo({ left: newScrollLeft, behavior: "smooth" });
  };

  const updateScrollBtns = useCallback(() => {
    const container = scrollableRef.current;
    if (!container) return;

    setCanScroll({
      left: container.scrollLeft > 0,
      right:
        container.scrollLeft < container.scrollWidth - container.offsetWidth,
    });
  }, []);

  useEffect(() => {
    updateScrollBtns(); // for initial mount
  }, [updateScrollBtns]);

  return (
    <div className={cn("relative", wrapperClassName)}>
      {canScroll.left && (
        <Button
          size={"icon-sm"}
          variant={"ghost"}
          className="-translate-y-1/2 fade-in absolute top-1/2 left-4 animate-in bg-background/90 hover:bg-background/95!"
          onClick={() => handleScroll("left")}
        >
          <ChevronLeft />
        </Button>
      )}
      <div
        ref={scrollableRef}
        className={cn("scrollbar-hide snap-x overflow-x-auto", className)}
        onScrollEnd={updateScrollBtns}
      >
        {children}
      </div>
      {canScroll.right && (
        <Button
          size={"icon-sm"}
          variant={"ghost"}
          className="-translate-y-1/2 fade-in absolute top-1/2 right-4 animate-in bg-background/90 hover:bg-background/95!"
          onClick={() => handleScroll("right")}
        >
          <ChevronRight />
        </Button>
      )}
    </div>
  );
}
