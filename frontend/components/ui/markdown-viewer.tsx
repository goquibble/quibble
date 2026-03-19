"use client";

import Superscript from "@tiptap/extension-superscript";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

export function MarkdownViewer({ content, className }: MarkdownViewerProps) {
  const editor = useEditor({
    extensions: [StarterKit, Superscript],
    content: content,
    editable: false,
    editorProps: {
      attributes: {
        class: cn(
          "prose dark:prose-invert max-w-none w-full text-base outline-none md:text-sm",
          "[&_h2]:text-lg [&_h2]:font-bold",
          "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2",
          "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2",
          "[&_li]:my-1",
          "[&_.ProseMirror-trailingBreak]:hidden",
        ),
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content) {
      // Only update if content has changed substantially (Tiptap handles HTML parsing diffs usually, but setContent is safe)
      // Check if content matches to avoid cursor jumps or re-renders if this was editable, but for readonly it's fine.
      // But editor.getHTML() might differ from content string slightly.
      // For a viewer, forced update on prop change is usually what we want if the prop changes.
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return <EditorContent editor={editor} className={className} />;
}
