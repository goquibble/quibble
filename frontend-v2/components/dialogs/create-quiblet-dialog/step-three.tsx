import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, Lock, type LucideProps, ScanEye } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const FormSchema = z.object({
  type: z.enum(["public", "restricted", "private"]),
});

const typeMapping: Record<
  z.infer<typeof FormSchema>["type"],
  {
    label: string;
    description: string;
    Icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
  }
> = {
  public: {
    label: "Public",
    description: "Anyone can view and contribute",
    Icon: Globe,
  },
  restricted: {
    label: "Restricted",
    description: "Anyone can view, but not contribute",
    Icon: ScanEye,
  },
  private: {
    label: "Private",
    description: "Only approved users can access",
    Icon: Lock,
  },
};

export default function StepThree() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: "public",
    },
  });

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="gap-0"
              >
                {Object.entries(typeMapping).map(([key, item]) => (
                  <FormItem
                    key={key}
                    className={cn(
                      "flex items-center justify-between rounded-md border border-transparent p-2",
                      field.value === key && "border-border bg-input/30",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <item.Icon
                        className={cn(
                          "size-5",
                          field.value === key && "text-primary",
                        )}
                      />
                      <div className="flex flex-col">
                        <FormLabel>{item.label}</FormLabel>
                        <FormDescription>{item.description}</FormDescription>
                      </div>
                    </div>
                    <FormControl>
                      <RadioGroupItem value={key} />
                    </FormControl>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />
    </Form>
  );
}
