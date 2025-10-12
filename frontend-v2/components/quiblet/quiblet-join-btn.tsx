import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { joinOrLeaveQuiblet } from "@/services/quiblet";
import { Button } from "../ui/button";

interface QuibletJoinBtnProps {
  name: string;
  hasJoined: boolean;
}

export default function QuibletJoinBtn({
  name,
  hasJoined,
}: QuibletJoinBtnProps) {
  const queryClient = useQueryClient();
  const [isJoined, setIsJoined] = useState(hasJoined);

  const mutation = useMutation({
    mutationFn: (action: "join" | "leave") => joinOrLeaveQuiblet(name, action),
    onSuccess: () => {
      setIsJoined((prev) => !prev);
      queryClient.invalidateQueries({
        queryKey: ["quiblet", name],
        exact: true,
      });
    },
  });

  const handleClick = () => {
    mutation.mutate(isJoined ? "leave" : "join");
  };

  return (
    <Button
      variant={isJoined ? "outline" : "default"}
      onClick={handleClick}
      disabled={mutation.isPending}
    >
      {isJoined ? "Joined" : "Join"}
    </Button>
  );
}
