"use client";
import { PlusCircle } from "lucide-react";
import { useAuthDialog } from "@/hooks/use-auth-dialog";
import { useAuthStore } from "@/stores/auth";
import CreateQuibletDialog from "../dialogs/create-quiblet-dialog/create-quiblet-dialog";
import { Button } from "../ui/button";

const CreateBtn = (props: React.ComponentProps<typeof Button>) => {
  return (
    <Button size={"sm"} variant={"outline"} {...props}>
      <PlusCircle />
      Create Quiblet
    </Button>
  );
};

export default function CreateQuibletBtn() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { showDialog } = useAuthDialog();

  return isAuthenticated ? (
    <CreateQuibletDialog>
      <CreateBtn />
    </CreateQuibletDialog>
  ) : (
    <CreateBtn onClick={showDialog} />
  );
}
