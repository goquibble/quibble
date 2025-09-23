"use client";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Data } from "./create-quiblet-dialog";

const DEFAULT_NAME = "quibletname";
const DEFAULT_DESCRIPTION = "Your quiblet description";

interface PreviewCardProps {
  data: Data;
}

export default function PreviewCard({ data }: PreviewCardProps) {
  const [avatarPreview, setAvatarPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");

  useEffect(() => {
    if (!data.avatar) return;
    const url = URL.createObjectURL(data.avatar);
    setAvatarPreview(url);
    // prevent memory leaks
    return () => URL.revokeObjectURL(url);
  }, [data.avatar]);

  useEffect(() => {
    if (!data.banner) return;
    const url = URL.createObjectURL(data.banner);
    setBannerPreview(url);
    // prevent memory leaks
    return () => URL.revokeObjectURL(url);
  }, [data.banner]);

  return (
    <div className="h-max w-60">
      <div
        className="h-10 rounded-t-md bg-center bg-cover bg-secondary"
        style={{
          backgroundImage: bannerPreview ? `url(${bannerPreview})` : undefined,
        }}
      ></div>
      <div className="flex flex-col rounded-b-md border border-t-0 p-4">
        <div className="flex gap-2">
          <Avatar className="size-10 rounded-md">
            <AvatarImage src={avatarPreview} />
            <AvatarFallback>
              {data.name ? data.name.slice(0, 2) : "QN"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="break-all font-medium">
              q/{data.name || DEFAULT_NAME}
            </span>
            <span className="text-muted-foreground text-xs">
              1 member — 1 online
            </span>
          </div>
        </div>
        <p className="mt-2 text-muted-foreground text-sm">
          {data.bio || DEFAULT_DESCRIPTION}
        </p>
      </div>
    </div>
  );
}
