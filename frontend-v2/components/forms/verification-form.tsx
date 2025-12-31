import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { useAuthDialog } from "@/hooks/use-auth-dialog";
import { setProfileIdCookie } from "@/lib/cookies";
import { VerificationFormSchema } from "@/schemas/auth";
import { verifySession } from "@/services/auth";
import { getUserProfiles } from "@/services/user";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

export default function VerificationForm() {
  const queryClient = useQueryClient();
  const { setCurrentStep } = useAuthDialog();
  const form = useForm<z.infer<typeof VerificationFormSchema>>({
    resolver: zodResolver(VerificationFormSchema),
    defaultValues: {
      key: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof VerificationFormSchema>) =>
      verifySession(values),
    onSuccess: async () => {
      const userProfiles = await queryClient.fetchQuery({
        queryKey: ["user-profiles"],
        queryFn: () => getUserProfiles(),
      });

      if (userProfiles.length > 1) {
        setCurrentStep(2);
      } else {
        const profileId = userProfiles[0].id;
        setProfileIdCookie(profileId);
        window.location.reload();
      }
    },
    onError: (err) => {
      // @ts-expect-error: type doesn't matter here
      const error = err.errors?.[0];

      if (error) {
        form.setError(error.param || "key", {
          type: error.code || "server",
          message: error.message,
        });
      }
    },
  });

  const onSubmit = async (values: z.infer<typeof VerificationFormSchema>) => {
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
          name="key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the OTP sent to your email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
}
