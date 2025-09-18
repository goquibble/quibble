"use client";
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
import StepOne from "./step-one";

const steps = [StepOne];

interface CreateQuibletDialogProps {
  children: React.ReactNode;
}

interface Data
  extends Partial<{
    name: string;
    bio: string;
    avatar: string;
    banner: string;
  }> {}

export default function CreateQuibletDialog({
  children,
}: CreateQuibletDialogProps) {
  const [currentStep] = useState(0);
  const [data, setData] = useState<Data>({});
  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false);
  const CurrentStep = steps[currentStep];

  const handleUpdate = useCallback((key: string, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleValidityChange = useCallback((valid: boolean) => {
    setIsCurrentStepValid(valid);
  }, []);

  return (
    <Dialog>
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
              onUpdate={handleUpdate}
              onValidityChange={handleValidityChange}
            />
          </div>
          <div className="h-max w-60">
            <div className="h-10 rounded-t-md bg-secondary"></div>
            <div className="flex flex-col rounded-b-md border border-t-0 p-4">
              <div className="flex gap-4">
                <div className="size-10 shrink-0 rounded-md bg-secondary"></div>
                <div className="flex flex-col">
                  <span className="break-all font-medium">
                    q/{data.name || "quibletname"}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    1 member — 1 online
                  </span>
                </div>
              </div>
              <p className="mt-2 text-muted-foreground text-sm">
                {data.bio || "Your quiblet description"}
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"}>Cancel</Button>
          </DialogClose>
          <Button disabled={!isCurrentStepValid}>Next</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
