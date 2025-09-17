"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Mail, ShieldEllipsis } from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useAuthDialog } from "@/hooks/use-auth-dialog";
import { useCsrfToken } from "@/hooks/use-csrf-token";
import { setProfileIdCookie } from "@/lib/cookies";
import { AuthFormSchema } from "@/schemas/auth";
import { authenticate } from "@/services/auth";
import { getUserProfiles } from "@/services/user";
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

export default function AuthForm({ mode }: AuthFormProps) {
  const csrfToken = useCsrfToken();
  const queryClient = useQueryClient();
  const { nextStep, setCurrentStep } = useAuthDialog();
  const form = useForm<z.infer<typeof AuthFormSchema>>({
    resolver: zodResolver(AuthFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof AuthFormSchema>) =>
      authenticate(mode, values, csrfToken),
    onSuccess: async ({ status }) => {
      if (status === 401 && mode === "signup") {
        nextStep();
      } else {
        try {
          const userProfiles = await queryClient.fetchQuery({
            queryKey: ["user-profiles"],
            queryFn: () => getUserProfiles(),
          });
          if (userProfiles.length > 1) {
            setCurrentStep(2);
          } else {
            const profileId = userProfiles[0].id;
            setProfileIdCookie(profileId);
          }
        } catch {
          form.setError("password", {
            type: "server",
            message: "Something went wrong! Please try again.",
          });
        }
      }
    },
    onError: (err) => {
      // @ts-expect-error: type doesn't matter here
      const error = err.errors?.[0];
      if (error) {
        form.setError(error.param || "password", {
          type: error.code || "server",
          message: error.message,
        });
      }
    },
  });

  const onSubmit = async (values: z.infer<typeof AuthFormSchema>) => {
    mutation.mutate(values);
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
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="animate-spin" />}
          {mode === "login" ? "Log in" : "Sign up"}
        </Button>
      </form>
    </Form>
  );
}
