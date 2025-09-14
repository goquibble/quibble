import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useAuthDialog } from "@/hooks/use-auth-dialog";
import { useCsrfToken } from "@/hooks/use-csrf-token";
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

const FormSchema = z.object({
  key: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export default function VerificationForm() {
  const csrfToken = useCsrfToken();
  const { nextStep: _ } = useAuthDialog();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      key: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const url = "http://localhost:8000/_allauth/browser/v1/auth/email/verify";
    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken ?? "",
      },
      body: JSON.stringify({ ...values }),
    });

    if (!res.ok) {
      const data = await res.json();
      const error = data.errors?.[0];

      if (error) {
        form.setError(error.param || "key", {
          type: error.code || "server",
          message: error.message,
        });
      }
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
