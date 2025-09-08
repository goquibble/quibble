"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, ShieldEllipsis } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuthDialog } from "@/context/auth-dialog-context";
import { useCsrfToken } from "@/hooks/use-csrf-token";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import IconInput from "../ui/icon-input";

const FormSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character",
    ),
});

export default function AuthForm() {
  const [loading, setLoading] = useState(false);
  const csrfToken = useCsrfToken();
  const { nextStep } = useAuthDialog();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:8000/_allauth/browser/v1/auth/login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken ?? "",
          },
          body: JSON.stringify({ ...values }),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        const error = data.errors?.[0];

        if (error?.param) {
          form.setError(error.param, {
            type: error.code,
            message: error.message,
          });
        } else {
          form.setError("password", {
            type: "server",
            message: error.message,
          });
        }
      } else {
        nextStep();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2.5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="gap-1">
              <FormControl>
                <IconInput Icon={Mail} placeholder="Email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="gap-1">
              <FormControl>
                <IconInput
                  Icon={ShieldEllipsis}
                  type="password"
                  placeholder="Password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="animate-spin" />}
          Continue
        </Button>
      </form>
    </Form>
  );
}
