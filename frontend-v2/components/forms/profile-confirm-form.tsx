import { zodResolver } from "@hookform/resolvers/zod";
import { AtSign } from "lucide-react";
import { type ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import IconInput from "../ui/icon-input";
import { Textarea } from "../ui/textarea";

const MAX_BIO_LENGTH = 200;

const FormSchema = z.object({
  username: z.string().min(6, "Username must be at least 6 characters."),
  bio: z.string().optional(),
});

export default function ProfileConfirmForm() {
  const [bioContentLength, setBioContentLength] = useState(0);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  });

  const handleBioChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setBioContentLength(
      value.length <= MAX_BIO_LENGTH
        ? value.length
        : value.slice(0, MAX_BIO_LENGTH).length,
    );
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2.5"
        onSubmit={form.handleSubmit(console.log)}
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="gap-1">
              <FormControl>
                <IconInput {...field} Icon={AtSign} placeholder="Username" />
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
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Bio (optional)"
                  className="resize-none"
                  onChange={handleBioChange}
                  maxLength={MAX_BIO_LENGTH}
                />
              </FormControl>
              <FormDescription className="flex items-center justify-between">
                <span>You can always change this!</span>
                <span>
                  {bioContentLength}/{MAX_BIO_LENGTH}
                </span>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Start Quibbling</Button>
      </form>
    </Form>
  );
}
