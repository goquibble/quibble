"use client";
import {
  Bell,
  ChartNoAxesColumn,
  ChartNoAxesColumnIncreasing,
  Home,
  LogIn,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthDialog } from "@/hooks/use-auth-dialog";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth";
import { Icons } from "../icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import PfpDropdown from "./pfp-dropdown";
import SearchBar from "./search-bar";

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
  const { showDialog } = useAuthDialog();
  const userProfile = useAuthStore((state) => state.userProfile);

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
        <SearchBar />
      </nav>
      <nav className="flex items-center gap-2">
        {userProfile ? (
          <>
            <Button>
              <Plus />
              Create Quib
            </Button>
            <Button variant={"outline"} size={"icon"}>
              <Bell />
            </Button>
            <PfpDropdown username={userProfile.username}>
              <Avatar className="size-9 rounded-md">
                <AvatarImage src={userProfile.avatar ?? ""} />
                <AvatarFallback>
                  {userProfile.username.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </PfpDropdown>
          </>
        ) : (
          <>
            <Button variant={"ghost"} onClick={showDialog}>
              Sign up
            </Button>
            <Button onClick={showDialog}>
              Log in <LogIn />
            </Button>
          </>
        )}
      </nav>
    </header>
  );
}
