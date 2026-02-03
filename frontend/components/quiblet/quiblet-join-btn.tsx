import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getQuibletMembership, joinOrLeaveQuiblet } from "@/services/quiblet";
import { useAuthStore } from "@/stores/auth";
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
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthStore();

  const { data: membershipStatus, isLoading: isMembershipLoading } = useQuery({
    queryKey: ["quiblet", name, "membership"],
    queryFn: () => getQuibletMembership(name),
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (membershipStatus !== undefined) {
      setIsJoined(membershipStatus);
    }
  }, [membershipStatus]);

  const mutation = useMutation({
    mutationFn: (action: "join" | "leave") => joinOrLeaveQuiblet(name, action),
    onSuccess: () => {
      setIsJoined((prev) => !prev);
      queryClient.invalidateQueries({
        queryKey: ["quiblet", name],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["quiblet", name, "membership"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-quiblets"],
      });
    },
  });

  const handleClick = () => {
    mutation.mutate(isJoined ? "leave" : "join");
  };

  if (isAuthLoading || (isAuthenticated && isMembershipLoading)) {
    return null;
  }

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
