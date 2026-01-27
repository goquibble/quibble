"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Define the form validation schema
const formSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(300, "Title cannot exceed 300 characters"),
    content: z.string().optional(),
    type: z.enum(["text", "media", "link", "poll"]),
    media: z.array(z.instanceof(File)).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "media" && (!data.media || data.media.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Image or video is required",
        path: ["media"],
      });
    }
  });

type FormValues = z.infer<typeof formSchema>;
type PostType = FormValues["type"];

// Constants
const POST_TYPES = [
  { id: "text", label: "Text", disabled: false },
  { id: "media", label: "Images & Video", disabled: false },
  { id: "link", label: "Link", disabled: true },
  { id: "poll", label: "Poll", disabled: true },
];

export default function SubmitPage() {
  const [activeType, setActiveType] = useState<PostType>("text");
  const [charCount, setCharCount] = useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      type: "text",
      media: [],
    },
  });

  function onSubmit(values: FormValues) {
    console.log("Form Submitted:", values);
    // TODO: Add API logic later
  }

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
      "video/*": [],
    },
    onDrop: (droppedFiles) => {
      form.setValue("media", droppedFiles, { shouldValidate: true });
    },
  });

  const selectedFiles = form.watch("media");

  return (
    <div className="mx-auto my-4 flex max-w-3xl flex-1 flex-col gap-4 px-4">
      <h3 className="font-bold text-2xl text-foreground">Create a Quib</h3>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {/* Type Switcher */}
          <div className="flex items-center gap-2">
            {POST_TYPES.map((type) => {
              const isActive = activeType === type.id;

              return (
                <button
                  key={type.id}
                  type="button"
                  disabled={type.disabled}
                  onClick={() => {
                    const newType = type.id as PostType;
                    setActiveType(newType);
                    form.setValue("type", newType);
                  }}
                  className={cn(
                    "relative flex w-max justify-center gap-2 rounded-md p-2 px-4 font-semibold transition-colors hover:bg-muted",
                    isActive && "text-primary",
                    type.disabled &&
                      "cursor-not-allowed opacity-50 hover:bg-transparent",
                  )}
                >
                  <span>{type.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 h-0.5 w-2/3 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="relative">
                <div className="relative">
                  <FormControl>
                    <Input
                      placeholder="Title*"
                      className="pr-16 font-medium text-lg"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e); // Trigger RHF
                        setCharCount(e.target.value.length);
                      }}
                    />
                  </FormControl>
                  <span
                    className={cn(
                      "-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground text-xs",
                      charCount > 300 && "text-destructive",
                    )}
                  >
                    {charCount}/300
                  </span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Dynamic Content Area */}
          {activeType === "text" && (
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Body Text (optional)"
                      className="min-h-[200px] resize-y bg-transparent!"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {activeType === "media" && (
            <FormField
              control={form.control}
              name="media"
              render={() => (
                // Removed unused field param
                <FormItem>
                  <FormControl>
                    <div className="flex flex-col gap-4">
                      <div
                        {...getRootProps()}
                        className={cn(
                          "flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-md border-2 border-muted-foreground/25 border-dashed bg-muted/5 p-10 text-center transition-colors hover:bg-muted/10",
                          isDragActive && "border-primary",
                        )}
                      >
                        <input {...getInputProps()} />
                        <p className="font-medium">
                          Drag & drop files or{" "}
                          <span className="text-primary hover:underline">
                            Upload
                          </span>
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Supported formats: Images & Video
                        </p>
                      </div>

                      {/* Preview Section */}
                      {selectedFiles && selectedFiles.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <p className="font-medium text-sm">Selected Files:</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedFiles.map((file, i) => (
                              <div
                                key={`${file.name}-${i}`}
                                className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm"
                              >
                                <span className="max-w-[200px] truncate">
                                  {file.name}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newFiles = [...selectedFiles];
                                    newFiles.splice(i, 1);
                                    form.setValue("media", newFiles);
                                  }}
                                  className="ml-2 text-muted-foreground hover:text-destructive"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline" type="button" disabled>
              Save Draft
            </Button>
            <Button
              type="submit"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>

      <div className="w-full flex-1" />
    </div>
  );
}
