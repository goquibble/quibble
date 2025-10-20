import { MessageCircleDashed } from "lucide-react";

export default function Comments404() {
  return (
    <div className="flex flex-col items-center gap-2">
      <MessageCircleDashed className="size-10 stroke-1 text-primary" />
      <span className="font-medium text-sm/none">No comments yet</span>
      <p className="text-muted-foreground text-sm/none">
        Be the first to share your thoughts!
      </p>
    </div>
  );
}
