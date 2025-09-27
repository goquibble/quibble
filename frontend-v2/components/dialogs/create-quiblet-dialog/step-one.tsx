import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
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
import { getApiUrl } from "@/lib/api-client";
import type { StepProps } from "./create-quiblet-dialog";

const MAX_NAME_LENGTH = 20;
const MIN_NAME_LENGTH = 3;
const MAX_DESCRIPTION_LENGTH = 150;

const FormSchema = z.object({
  name: z
    .string()
    .min(MIN_NAME_LENGTH, "Name must be at least 3 characters long")
    .max(MAX_NAME_LENGTH),
  description: z
    .string()
    .min(1, "Description too short")
    .max(MAX_DESCRIPTION_LENGTH, "Description too long"),
});

async function checkIsUniqueName(name: string): Promise<boolean> {
  const url = getApiUrl(`api/v1/quiblet/is-unique-name?name=${name}`);
  const res = await fetch(url);

  if (!res.ok) return false;
  return (await res.json()).unique;
}

export default function StepOne({
  data,
  onUpdate,
  onValidityChange,
}: StepProps) {
  const [isUniqueName, setIsUniqueName] = useState(false);
  const [isCheckingUniqueName, setIsCheckingUniqueName] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      name: data?.name || "",
      description: data?.description || "",
    },
  });

  const name = form.watch("name");
  const description = form.watch("description");

  const debouncedUniqueNameCheck = useDebouncedCallback(
    async (name: string) => {
      const isUnique = await checkIsUniqueName(name);
      setIsUniqueName(isUnique);
      setIsCheckingUniqueName(false);

      if (!isUnique) {
        form.setError("name", {
          type: "unique",
          message: "This name is already taken",
        });
      } else if (form.getFieldState("name").error?.type === "unique") {
        form.clearErrors("name");
      }
    },
    1000,
  );

  useEffect(() => {
    const nameError = form.formState.errors.name;
    if (nameError || name.length < MIN_NAME_LENGTH) {
      setIsUniqueName(false);
      return;
    }
    // only call unique checker if there are no zod errors
    setIsCheckingUniqueName(true);
    debouncedUniqueNameCheck(name);
  }, [name, form.formState.errors.name, debouncedUniqueNameCheck]);

  useEffect(() => {
    onUpdate("name", name);
  }, [name, onUpdate]);

  useEffect(() => {
    onUpdate("description", description);
  }, [description, onUpdate]);

  // update parent component valid state
  useEffect(() => {
    const isValid =
      form.formState.isValid && isUniqueName && !isCheckingUniqueName;
    onValidityChange(isValid);
  }, [
    form.formState.isValid,
    isUniqueName,
    isCheckingUniqueName,
    onValidityChange,
  ]);

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
                {field.value.length}/{MAX_NAME_LENGTH}
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
        name="description"
        render={({ field }) => (
          <FormItem className="gap-1">
            <div className="flex items-center justify-between">
              <FormLabel>Description*</FormLabel>
              <FormDescription>
                {field.value.length}/{MAX_DESCRIPTION_LENGTH}
              </FormDescription>
            </div>
            <FormControl>
              <Textarea
                placeholder="Something about your quiblet..."
                maxLength={MAX_DESCRIPTION_LENGTH}
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
