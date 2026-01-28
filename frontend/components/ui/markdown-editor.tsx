"use client";

import Placeholder from "@tiptap/extension-placeholder";
import Superscript from "@tiptap/extension-superscript"; // Extension
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading as HeadingIcon,
  Italic,
  List as ListIcon,
  ListOrdered, // Icon
  Strikethrough,
  Superscript as SuperscriptIcon, // Icon
} from "lucide-react";
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
      Superscript,
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
          "[&_h2]:text-2xl [&_h2]:font-bold",
          "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2",
          "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2",
          "[&_li]:my-1",
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
  const toggleSuperscript = () =>
    editor?.chain().focus().toggleSuperscript().run();
  const toggleHeading = () =>
    editor?.chain().focus().toggleHeading({ level: 2 }).run();
  const toggleBulletList = () =>
    editor?.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () =>
    editor?.chain().focus().toggleOrderedList().run();

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
      <div className="flex flex-wrap items-center gap-1 p-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={toggleBold}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={cn("h-8 w-8", editor.isActive("bold") && "bg-muted")}
          title="Bold"
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
          title="Italic"
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
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={toggleSuperscript}
          disabled={!editor.can().chain().focus().toggleSuperscript().run()}
          className={cn(
            "h-8 w-8",
            editor.isActive("superscript") && "bg-muted",
          )}
          title="Superscript"
        >
          <SuperscriptIcon className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={toggleHeading}
          disabled={
            !editor.can().chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={cn(
            "h-8 w-8",
            editor.isActive("heading", { level: 2 }) && "bg-muted",
          )}
          title="Heading"
        >
          <HeadingIcon className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={toggleBulletList}
          disabled={!editor.can().chain().focus().toggleBulletList().run()}
          className={cn("h-8 w-8", editor.isActive("bulletList") && "bg-muted")}
          title="Bullet List"
        >
          <ListIcon className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={toggleOrderedList}
          disabled={!editor.can().chain().focus().toggleOrderedList().run()}
          className={cn(
            "h-8 w-8",
            editor.isActive("orderedList") && "bg-muted",
          )}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      <EditorContent editor={editor} className="flex-1" />
    </div>
  );
});

MarkdownEditor.displayName = "MarkdownEditor";
