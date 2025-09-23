import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formatBytes } from "@/lib/utils";
import type { StepProps } from "./create-quiblet-dialog";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const fileSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size < MAX_FILE_SIZE,
    "File size must be less than 5MB",
  );

const StepTwoSchema = z.object({
  avatar: fileSchema.optional().nullable(),
  banner: fileSchema.optional().nullable(),
});

export default function StepTwo({ onValidityChange }: StepProps) {
  const form = useForm<z.infer<typeof StepTwoSchema>>({
    resolver: zodResolver(StepTwoSchema),
    mode: "onChange",
    defaultValues: {
      avatar: null,
      banner: null,
    },
  });

  useEffect(() => {
    onValidityChange(form.formState.isValid);
  }, [form.formState.isValid, onValidityChange]);

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="avatar"
        render={({ field: { onChange, value, ...field } }) => (
          <FormItem className="gap-1">
            <div className="flex items-center justify-between">
              <FormLabel>Avatar</FormLabel>
              <FormMessage>
                {form.getValues("avatar")
                  ? `${formatBytes((form.getValues("avatar") as File).size)} (max ${formatBytes(MAX_FILE_SIZE)})`
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
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="banner"
        render={({ field: { onChange, value, ...field } }) => (
          <FormItem className="gap-1">
            <div className="flex items-center justify-between">
              <FormLabel>Banner</FormLabel>
              <FormMessage>
                {form.getValues("banner")
                  ? `${formatBytes((form.getValues("banner") as File).size)} (max ${formatBytes(MAX_FILE_SIZE)})`
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
          </FormItem>
        )}
      />
    </Form>
  );
}
