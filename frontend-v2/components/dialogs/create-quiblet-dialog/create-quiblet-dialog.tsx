"use client";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCsrfToken } from "@/hooks/use-csrf-token";
import { cn } from "@/lib/utils";
import { createQuiblet } from "@/services/quiblet";
import type { Nullable } from "@/types/generics";
import PreviewCard from "./preview-card";
import StepOne from "./step-one";
import StepThree from "./step-three";
import StepTwo from "./step-two";

const steps = [StepOne, StepTwo, StepThree];

interface CreateQuibletDialogProps {
  children: React.ReactNode;
}

export interface Data
  extends Partial<{
    name: string;
    description: string;
    type: string;
    nsfw: boolean;
    avatar: Nullable<File>;
    banner: Nullable<File>;
  }> {}

type UpdateValue = Nullable<string | File | boolean | undefined>;
export interface StepProps {
  data?: Data;
  onUpdate: (key: string, value: UpdateValue) => void;
  onValidityChange: (valid: boolean) => void;
}

export default function CreateQuibletDialog({
  children,
}: CreateQuibletDialogProps) {
  const _csrfToken = useCsrfToken();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<Data>({});
  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false);
  const CurrentStep = steps[currentStep];

  const mutation = useMutation({
    mutationFn: () => createQuiblet(data),
    onSuccess: ({ name }) => {
      router.push(`/q/${name}`);
      setOpen(false);
    },
  });

  const handleUpdate = useCallback((key: string, value: UpdateValue) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleValidityChange = useCallback((valid: boolean) => {
    setIsCurrentStepValid(valid);
  }, []);

  const handleNextOrSubmit = () => {
    if (currentStep !== steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      mutation.mutate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Quiblet</DialogTitle>
          <DialogDescription>
            Bring people together around what you love.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <CurrentStep
              data={data}
              onUpdate={handleUpdate}
              onValidityChange={handleValidityChange}
            />
          </div>
          <PreviewCard data={data} />
        </div>
        <DialogFooter>
          <div className="mr-auto flex items-center gap-2">
            {Array.from({ length: steps.length }).map((_, idx) => (
              <span
                key={`step-indicator-${idx.toString()}`}
                className={cn(
                  "size-2 rounded-full",
                  currentStep === idx ? "bg-primary" : "bg-accent",
                )}
              ></span>
            ))}
          </div>
          {currentStep > 0 ? (
            <Button
              variant={"outline"}
              onClick={() => setCurrentStep((prev) => prev - 1)}
            >
              Back
            </Button>
          ) : (
            <DialogClose asChild>
              <Button variant={"outline"}>Cancel</Button>
            </DialogClose>
          )}
          <Button
            disabled={!isCurrentStepValid || mutation.isPending}
            onClick={handleNextOrSubmit}
          >
            {mutation.isPending && <Loader2 className="animate-spin" />}
            {currentStep === steps.length - 1 ? "Create Quiblet" : "Next"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
