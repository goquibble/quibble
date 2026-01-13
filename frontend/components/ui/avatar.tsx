"use client";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import Image from "next/image";
import type * as React from "react";

import { cn, getAvatarUrl } from "@/lib/utils";

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn("relative flex size-8 shrink-0", className)}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full rounded-full", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  seed,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback> & {
  seed?: string;
}) {
  const avatarUrl = getAvatarUrl(seed);
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn("relative flex size-full", className)}
      {...props}
    >
      <Image src={avatarUrl} alt={`avatar-${seed}`} fill={true} />
    </AvatarPrimitive.Fallback>
  );
}

export { Avatar, AvatarImage, AvatarFallback };
