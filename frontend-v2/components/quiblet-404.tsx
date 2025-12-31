import { Home } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

interface Quiblet404Props {
  name: string;
}

export default function Quiblet404({ name }: Quiblet404Props) {
  return (
    <div className="mx-auto flex flex-col items-center gap-1">
      <span className="font-medium text-destructive">q/{name}</span>
      <span className="font-medium">404: Quiblet not found!</span>
      <Link href={"/"}>
        <Button variant={"link"}>
          <Home />
          Go Home
        </Button>
      </Link>
    </div>
  );
}
