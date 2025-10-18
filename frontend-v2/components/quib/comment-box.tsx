"use client";

import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export default function CommentBox() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-2">
      {open ? (
        <div className="flex flex-col gap-2">
          <Textarea
            autoFocus
            placeholder="Add your comment"
            className="scrollbar-hide"
          />
          <div className="flex gap-2">
            <Button
              size={"sm"}
              variant={"outline"}
              onClick={() => setOpen(false)}
              className="ml-auto"
            >
              Cancel
            </Button>
            <Button size={"sm"}>Comment</Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="flex w-full cursor-text items-center gap-2 rounded-md border bg-input/30 p-2 px-3"
          onClick={() => setOpen(true)}
        >
          <MessageCircle className="size-4 text-muted-foreground" />
          <span className="text-muted-foreground text-sm">
            Add your comment
          </span>
        </button>
      )}
    </div>
  );
}
