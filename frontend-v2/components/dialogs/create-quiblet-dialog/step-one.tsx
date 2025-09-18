import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const MAX_NAME_LENGTH = 20;
const MAX_BIO_LENGTH = 150;

const StepOneSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(MAX_NAME_LENGTH),
  bio: z
    .string()
    .min(1, "Description too short")
    .max(MAX_BIO_LENGTH, "Description too long"),
});

interface StepOneProps {
  onUpdate: (key: string, value: string) => void;
  onValidityChange: (valid: boolean) => void;
}

export default function StepOne({ onUpdate, onValidityChange }: StepOneProps) {
  const form = useForm<z.infer<typeof StepOneSchema>>({
    resolver: zodResolver(StepOneSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      bio: "",
    },
  });

  // watch values for storing values
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
            <FormControl>
              <Input
                placeholder="Quiblet name*"
                maxLength={MAX_NAME_LENGTH}
                {...field}
              />
            </FormControl>
            <div className="flex items-center gap-2">
              <FormMessage />
              <span className="ml-auto text-muted-foreground text-sm">
                {field.value.length}/{MAX_NAME_LENGTH}
              </span>
            </div>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem className="gap-1">
            <FormControl>
              <Textarea
                placeholder="Description*"
                maxLength={MAX_BIO_LENGTH}
                className="h-40"
                {...field}
              />
            </FormControl>
            <div className="flex items-center gap-2">
              <FormMessage />
              <span className="ml-auto text-muted-foreground text-sm">
                {field.value.length}/{MAX_BIO_LENGTH}
              </span>
            </div>
          </FormItem>
        )}
      />
    </Form>
  );
}
