import { LogOut, Settings } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { logOutSession } from "@/services/auth";

interface PfpDropdownProps {
  children: React.ReactNode;
  username: string;
}

export default function PfpDropdown({ children, username }: PfpDropdownProps) {
  const handleLogOut = async () => {
    await logOutSession();
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "rounded-md transition-shadow",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        )}
      >
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenuLabel>u/{username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/u/${username}`}>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          Settings
          <Settings className="ml-auto" />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleLogOut}>
          Log out
          <LogOut className="ml-auto" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
