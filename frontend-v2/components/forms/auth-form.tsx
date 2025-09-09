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

interface AuthFormProps {
  mode: "login" | "signup";
}

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

export default function AuthForm({ mode }: AuthFormProps) {
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
      const url = `http://localhost:8000/_allauth/browser/v1/auth/${mode}`;
      const body: Record<typeof mode, Record<string, string>> = {
        login: { ...values },
        signup: {
          email: values.email,
          password: values.password,
        },
      };

      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken ?? "",
        },
        body: JSON.stringify(body[mode]),
      });

      if (!res.ok) {
        // if account is already ready to verify
        if (res.status === 401 && mode === "signup") {
          nextStep();
        }

        const data = await res.json();
        const error = data.errors?.[0];

        if (error) {
          form.setError(error.param || "password", {
            type: error.code || "server",
            message: error.message,
          });
        }
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
          {mode === "login" ? "Log in" : "Sign up"}
        </Button>
      </form>
    </Form>
  );
}
