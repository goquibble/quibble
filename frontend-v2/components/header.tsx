"use client";

import {
  ChartNoAxesColumn,
  ChartNoAxesColumnIncreasing,
  Home,
  LogIn,
  Search,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import IconInput from "./ui/icon-input";

const navLinkMapping = [
  {
    href: "/",
    Icon: Home,
    label: "Home",
    isDisabled: false,
  },
  {
    href: "/q/popular",
    Icon: ChartNoAxesColumnIncreasing,
    label: "Popular",
    isDisabled: true,
  },
  {
    href: "/q/all",
    Icon: ChartNoAxesColumn,
    label: "All",
    isDisabled: true,
  },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="flex h-14 items-center justify-between border-b px-4">
      <Link href={"/"} className="flex items-center gap-2">
        <Icons.icon className="size-6" />
        <Icons.logo className="h-6 w-max" />
      </Link>
      <nav className="flex items-center gap-2">
        {navLinkMapping.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              tabIndex={item.isDisabled ? -1 : 0}
              aria-disabled={item.isDisabled}
              className={cn(
                "flex items-center gap-2",
                item.isDisabled && "pointer-events-none opacity-75",
              )}
            >
              <item.Icon className={cn("size-5", isActive && "text-primary")} />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
        <IconInput
          Icon={Search}
          placeholder="Search..."
          wrapperClassName="ml-2"
          className="w-100"
        />
      </nav>
      <nav className="flex items-center gap-2">
        <Button variant={"ghost"}>Sign up</Button>
        <Button>
          Log in <LogIn />
        </Button>
      </nav>
    </header>
  );
}
