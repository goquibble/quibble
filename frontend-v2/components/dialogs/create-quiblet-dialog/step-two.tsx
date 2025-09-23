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
import type { StepProps } from "./create-quiblet-dialog";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

const fileSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size < MAX_FILE_SIZE,
    `Max Size is ${formatBytes(MAX_FILE_SIZE)}`,
  );

const FormSchema = z.object({
  avatar: fileSchema.optional().nullable(),
  banner: fileSchema.optional().nullable(),
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
      avatar: data?.avatar,
      banner: data?.banner,
    },
  });

  // watch values for storing values
  const avatar = form.watch("avatar");
  const banner = form.watch("banner");

  useEffect(() => {
    onUpdate("avatar", avatar);
  }, [avatar, onUpdate]);

  useEffect(() => {
    onUpdate("banner", banner);
  }, [banner, onUpdate]);

  useEffect(() => {
    onValidityChange(form.formState.isValid);
  }, [form.formState.isValid, onValidityChange]);

  return (
    <Form {...form}>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="avatar"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem className="h-max gap-1">
              <div className="flex items-center justify-between">
                <FormLabel>Avatar</FormLabel>
                <FormMessage>
                  {form.getValues("avatar")
                    ? `${formatBytes((form.getValues("avatar") as File).size)}`
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
              {data?.avatar && (
                <FormDescription>{data.avatar.name}</FormDescription>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="banner"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem className="h-max gap-1">
              <div className="flex items-center justify-between">
                <FormLabel>Banner</FormLabel>
                <FormMessage>
                  {form.getValues("banner")
                    ? `${formatBytes((form.getValues("banner") as File).size)}`
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
              {data?.banner && (
                <FormDescription>{data.banner.name}</FormDescription>
              )}
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
}
