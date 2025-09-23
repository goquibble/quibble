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
import { Textarea } from "@/components/ui/textarea";
import type { StepProps } from "./create-quiblet-dialog";

const MAX_NAME_LENGTH = 20;
const MAX_BIO_LENGTH = 150;

const FormSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(MAX_NAME_LENGTH),
  bio: z
    .string()
    .min(1, "Description too short")
    .max(MAX_BIO_LENGTH, "Description too long"),
});

export default function StepOne({
  data,
  onUpdate,
  onValidityChange,
}: StepProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      name: data?.name || "",
      bio: data?.bio || "",
    },
  });

  const name = form.watch("name");
  const bio = form.watch("bio");

  useEffect(() => {
    onUpdate("name", name);
  }, [name, onUpdate]);

  useEffect(() => {
    onUpdate("bio", bio);
  }, [bio, onUpdate]);

  // update parent component valid state
  useEffect(() => {
    console.log(form.formState.isValid);
    onValidityChange(form.formState.isValid);
  }, [form.formState.isValid, onValidityChange]);

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="gap-1">
            <div className="flex items-center justify-between">
              <FormLabel>Name*</FormLabel>
              <FormDescription>
                {field.value.length}/{MAX_BIO_LENGTH}
              </FormDescription>
            </div>
            <FormControl>
              <Input
                placeholder="Quiblet name"
                maxLength={MAX_NAME_LENGTH}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem className="gap-1">
            <div className="flex items-center justify-between">
              <FormLabel>Description*</FormLabel>
              <FormDescription>
                {field.value.length}/{MAX_BIO_LENGTH}
              </FormDescription>
            </div>
            <FormControl>
              <Textarea
                placeholder="Something about your quiblet..."
                maxLength={MAX_BIO_LENGTH}
                className="h-40"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
}
