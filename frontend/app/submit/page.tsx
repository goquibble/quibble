"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Search, Sparkles, Trash, X } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import * as z from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import api from "@/lib/api";
import { cn, getAvatarUrl } from "@/lib/utils";

// Define the form validation schema
const formSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(300, "Title cannot exceed 300 characters"),
    content: z.string().optional(),
    type: z.enum(["text", "media", "link", "poll"]),
    media: z
      .array(z.instanceof(File))
      .max(1, "Only one image is allowed")
      .optional(),
    quiblet: z.string().min(1, "Please select a quiblet"), // Store quiblet ID
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

interface QuibletOption {
  id: number;
  name: string;
  avatar: string | null;
  members_count: number;
}

export default function SubmitPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeType, setActiveType] = useState<PostType>("text");
  const [charCount, setCharCount] = useState(0);

  // Quiblet Selector State
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuiblet, setSelectedQuiblet] = useState<Pick<
    QuibletOption,
    "name" | "avatar"
  > | null>(null);
  const [debouncedQuery] = useDebounce(searchQuery, 300);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      type: "text",
      media: [],
      quiblet: "",
    },
  });

  useEffect(() => {
    const quibletName = searchParams.get("q");
    if (quibletName) {
      form.setValue("quiblet", quibletName);
      setSelectedQuiblet({
        name: quibletName,
        avatar: getAvatarUrl(quibletName),
      });
    }
  }, [searchParams, form]);

  // Fetch Quiblets
  const { data: quiblets, isLoading } = useQuery({
    queryKey: ["quiblets", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery) return [];
      const res = await api.get<QuibletOption[]>(
        API_ENDPOINTS.QUIBLET_SEARCH(debouncedQuery),
      );
      return res.data;
    },
    enabled: isSelectorOpen && debouncedQuery.length > 0,
    staleTime: 60000,
  });

  async function handleGenerateTitle() {
    const content = form.getValues("content");
    if (!content || content.length < 50) {
      toast.error("Content is too short to generate a title (min 50 chars).");
      return;
    }

    toast.promise(
      api.post<{ title: string }>(API_ENDPOINTS.GENERATE_TITLE, { content }),
      {
        loading: "Generating title...",
        success: (res) => {
          form.setValue("title", res.data.title, { shouldValidate: true });
          setCharCount(res.data.title.length);
          return "Title generated successfully!";
        },
        error: "Failed to generate title",
      },
    );
  }

  async function onSubmit(values: FormValues) {
    try {
      const formData = new FormData();
      formData.append("title", values.title);

      // Only append content if it's a text post
      if (values.type === "text" && values.content) {
        formData.append("content", values.content);
      }

      // Only append media if it's a media post
      if (values.type === "media" && values.media?.[0]) {
        formData.append("cover", values.media[0]);
      }

      const res = await api.post(
        API_ENDPOINTS.QUIBLET_CREATE_QUIB(values.quiblet),
        formData,
      );

      // Navigate to the created quib
      // Response is QuibSchema: { quiblet: { name: ... }, id: ..., slug: ... }
      const quibletName = values.quiblet; // Or res.data.quiblet.name
      const { id, slug } = res.data;
      router.push(`/q/${quibletName}/quib/${id}/${slug}`);
    } catch (error) {
      console.error("Failed to create quib:", error);
      // TODO: Add toast notification here
    }
  }

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/gif": [],
      "image/webp": [],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (droppedFiles) => {
      form.setValue("media", droppedFiles, { shouldValidate: true });
    },
  });

  const selectedFiles = form.watch("media");

  return (
    <div className="mx-auto my-4 flex max-w-3xl flex-1 flex-col gap-4 px-4">
      <h3 className="font-bold text-2xl text-foreground">Create a Quib</h3>

      <Form {...form}>
        {/* Quiblet Selector */}
        <FormField
          control={form.control}
          name="quiblet"
          render={({ field }) => (
            <FormItem className="relative w-max">
              <FormControl>
                <Popover
                  open={isSelectorOpen && !!searchQuery}
                  onOpenChange={() => {}}
                >
                  <PopoverAnchor asChild>
                    {!isSelectorOpen ? (
                      <button
                        type="button"
                        onClick={() => setIsSelectorOpen(true)}
                        className="flex h-9 min-w-[200px] items-center justify-between gap-2 rounded-md border border-input px-3 py-2 text-sm transition-colors hover:bg-input/30"
                      >
                        {selectedQuiblet ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarImage
                                src={selectedQuiblet.avatar || undefined}
                              />
                              <AvatarFallback>
                                {selectedQuiblet.name[0]?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">
                              q/{selectedQuiblet.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">
                            Select a Quiblet
                          </span>
                        )}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </button>
                    ) : (
                      <div className="relative min-w-[300px]">
                        <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          autoFocus
                          placeholder="Search communities..."
                          value={searchQuery}
                          className="pr-8 pl-9"
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onBlur={() => setIsSelectorOpen(false)}
                        />
                        <X
                          className="-translate-y-1/2 absolute top-1/2 right-3 h-4 w-4 cursor-pointer text-muted-foreground"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            if (searchQuery) {
                              setSearchQuery("");
                            } else {
                              setIsSelectorOpen(false);
                            }
                          }}
                        />
                      </div>
                    )}
                  </PopoverAnchor>

                  <PopoverContent
                    sideOffset={10}
                    className="flex w-[var(--radix-popover-trigger-width)] flex-col gap-2 p-1"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                  >
                    {isLoading ? (
                      <div className="p-2 text-center text-muted-foreground text-sm">
                        Loading...
                      </div>
                    ) : quiblets && quiblets.length > 0 ? (
                      quiblets.map((quiblet) => (
                        <button
                          type="button"
                          key={quiblet.id}
                          className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm"
                          onMouseDown={(e) => {
                            e.preventDefault(); // Prevent blur when clicking
                            setSelectedQuiblet(quiblet);
                            field.onChange(quiblet.name); // Validates automatically
                            setIsSelectorOpen(false);
                            setSearchQuery("");
                          }}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={quiblet.avatar || undefined} />
                            <AvatarFallback>
                              {quiblet.name[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              q/{quiblet.name}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              {quiblet.members_count || 0} member(s)
                            </span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-2 text-center text-muted-foreground text-sm">
                        No communities found.
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                    form.setValue("type", newType, { shouldValidate: true });
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
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
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
                  <Button
                    type="button"
                    variant={"outline"}
                    onClick={handleGenerateTitle}
                    disabled={activeType !== "text"}
                  >
                    <Sparkles />
                    Generate
                  </Button>
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
                    <MarkdownEditor
                      placeholder="Body Text (optional)"
                      autofocus={false}
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
                <FormItem>
                  <FormControl>
                    <div className="flex flex-col gap-4">
                      {!selectedFiles || selectedFiles.length === 0 ? (
                        <div
                          {...getRootProps()}
                          className={cn(
                            "flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-md border-2 border-muted-foreground/25 border-dashed p-10 text-center transition-colors hover:bg-muted/10",
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
                            Supported formats: JPG, PNG, GIF & Max file size:
                            5MB
                          </p>
                        </div>
                      ) : (
                        <div className="relative overflow-hidden rounded-md border">
                          <div className="relative flex aspect-video max-h-[200px] w-full items-center justify-center">
                            {/* We create a URL for preview */}
                            <Image
                              src={URL.createObjectURL(selectedFiles[0])}
                              alt="Preview"
                              fill
                              unoptimized
                              className="object-contain"
                            />
                          </div>
                          <Button
                            variant={"ghost"}
                            size={"icon-sm"}
                            onClick={() =>
                              form.setValue("media", [], {
                                shouldValidate: true,
                              })
                            }
                            className="absolute top-2 right-2"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
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
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
