"use client";

import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, Strikethrough } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MarkdownEditorProps {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  // We accept other props to satisfy spread, but specific ones for RHF might be handled manually
  // mostly just name, onBlur, ref
  name?: string;
  onBlur?: () => void;
}

export const MarkdownEditor = React.forwardRef<
  HTMLDivElement,
  MarkdownEditorProps
>(({ className, value, onChange, placeholder, onBlur, ...props }, ref) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || "Write something...",
        emptyEditorClass:
          "cursor-text before:content-[attr(data-placeholder)] before:absolute before:text-muted-foreground before:opacity-50 before-pointer-events-none",
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: cn(
          "prose dark:prose-invert max-w-none min-h-[200px] w-full rounded-md bg-transparent px-3 py-2 text-base shadow-none outline-none md:text-sm",
          "focus-visible:outline-none focus:outline-none",
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    onBlur: () => {
      onBlur?.();
    },
    immediatelyRender: false, // Fixes some SSR hydration mismatches
  });

  // Sync external value changes (if controlled strictly) is tricky with Tiptap
  // Usually RHF doesn't change value externally while typing, only on reset.
  // We can add a useEffect to watch `value` if needed, but for now we trust initial render + internal state.

  // Expose focus via ref if needed by RHF.
  // RHF passes a ref that expects a DOM element. We can attach it to the parent div or try to proxy it.
  // For now, attaching to the container div is safest for "focus" (though Tiptap is inside).

  const toggleBold = () => editor?.chain().focus().toggleBold().run();
  const toggleItalic = () => editor?.chain().focus().toggleItalic().run();
  const toggleStrike = () => editor?.chain().focus().toggleStrike().run();

  if (!editor) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col rounded-md border border-input bg-transparent shadow-xs transition-[box-shadow] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
        className,
      )}
      {...props} // pass name/etc if needed
    >
      <div className="flex items-center gap-1 p-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={toggleBold}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={cn("h-8 w-8", editor.isActive("bold") && "bg-muted")}
        >
          <Bold className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={toggleItalic}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={cn("h-8 w-8", editor.isActive("italic") && "bg-muted")}
        >
          <Italic className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={toggleStrike}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={cn("h-8 w-8", editor.isActive("strike") && "bg-muted")}
        >
          <Strikethrough className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      <EditorContent editor={editor} className="flex-1" />
    </div>
  );
});

MarkdownEditor.displayName = "MarkdownEditor";
