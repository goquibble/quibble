import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formatBytes } from "@/lib/utils";
import type { StepProps } from "./index";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

const fileSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size < MAX_FILE_SIZE,
    `Max Size is ${formatBytes(MAX_FILE_SIZE)}`,
  );

const FormSchema = z.object({
  avatar_file: fileSchema.optional().nullable(),
  banner_file: fileSchema.optional().nullable(),
});

export default function StepTwo({
  data,
  onUpdate,
  onValidityChange,
}: StepProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      avatar_file: data?.avatar_file,
      banner_file: data?.banner_file,
    },
  });

  const avatar_file = form.watch("avatar_file");
  const banner_file = form.watch("banner_file");

  useEffect(() => {
    onUpdate("avatar_file", avatar_file);
  }, [avatar_file, onUpdate]);

  useEffect(() => {
    onUpdate("banner_file", banner_file);
  }, [banner_file, onUpdate]);

  useEffect(() => {
    onValidityChange(form.formState.isValid);
  }, [form.formState.isValid, onValidityChange]);

  return (
    <Form {...form}>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="avatar_file"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem className="h-max gap-1">
              <div className="flex items-center justify-between">
                <FormLabel>Avatar</FormLabel>
                <FormMessage>
                  {form.getValues("avatar_file")
                    ? `${formatBytes((form.getValues("avatar_file") as File).size)}`
                    : `(max ${formatBytes(MAX_FILE_SIZE)})`}
                </FormMessage>
              </div>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  {...field}
                  onChange={(e) => onChange(e.target.files?.[0] ?? null)}
                />
              </FormControl>
              {data?.avatar_file && (
                <FormDescription>{data.avatar_file.name}</FormDescription>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="banner_file"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem className="h-max gap-1">
              <div className="flex items-center justify-between">
                <FormLabel>Banner</FormLabel>
                <FormMessage>
                  {form.getValues("banner_file")
                    ? `${formatBytes((form.getValues("banner_file") as File).size)}`
                    : `(max ${formatBytes(MAX_FILE_SIZE)})`}
                </FormMessage>
              </div>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  {...field}
                  onChange={(e) => onChange(e.target.files?.[0] ?? null)}
                />
              </FormControl>
              {data?.banner_file && (
                <FormDescription>{data.banner_file.name}</FormDescription>
              )}
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
}
