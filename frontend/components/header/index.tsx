"use client";
import {
  Bell,
  ChartNoAxesColumn,
  ChartNoAxesColumnIncreasing,
  Home,
  LogIn,
  Plus,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth";
import { Icons } from "../icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
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
  const userProfile = useAuthStore((state) => state.userProfile);
  const isLoading = useAuthStore((state) => state.isLoading);

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-background px-4">
      <Link href={"/"} className="flex items-center gap-2">
        <Icons.quibbleIcon className="size-6" />
        <Icons.quibbleLogo className="h-6 w-max" />
      </Link>
      <nav className="md:-translate-x-1/2 flex items-center gap-2 md:absolute md:left-1/2">
        {navLinkMapping.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              tabIndex={item.isDisabled ? -1 : 0}
              aria-disabled={item.isDisabled}
              className={cn(
                "hidden items-center gap-2 md:flex",
                isActive && "text-primary",
                item.isDisabled && "pointer-events-none opacity-75",
              )}
            >
              <item.Icon className="size-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
        <SearchBar />
        <Button variant={"ghost"} className="hidden md:flex" asChild>
          <Link href="/search" className="border">
            <Sparkles className="size-4 text-purple-500" />
            <span>AI Search</span>
          </Link>
        </Button>
      </nav>
      <nav className="flex items-center gap-2">
        {isLoading ? (
          <>
            <Skeleton className="h-8 w-31 md:h-9" />
            <Skeleton className="h-8 w-9 md:h-9 md:w-20" />
          </>
        ) : userProfile ? (
          <>
            <Link href="/submit">
              <Button className="h-8 md:h-9">
                <Plus />
                Create Quib
              </Button>
            </Link>
            <Button
              variant={"outline"}
              size={"icon"}
              className="hidden md:flex"
              disabled
            >
              <Bell />
            </Button>
            <PfpDropdown username={userProfile.username}>
              <Avatar className="size-8 rounded-md md:size-9">
                <AvatarImage src={userProfile.avatar_url ?? ""} />
                <AvatarFallback seed={userProfile.username} />
              </Avatar>
            </PfpDropdown>
          </>
        ) : (
          <>
            <Button variant={"ghost"} className="h-8 md:h-9" asChild>
              <Link href={`${API_ENDPOINTS.AUTH_APP_URL}/create-account`}>
                Sign up
              </Link>
            </Button>
            <Button className="h-8 md:h-9" asChild>
              <Link href={`${API_ENDPOINTS.AUTH_APP_URL}/log-in`}>
                Log in <LogIn className="ml-2" />
              </Link>
            </Button>
          </>
        )}
      </nav>
    </header>
  );
}
