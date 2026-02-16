import type { Metadata } from "next";
import { Suspense } from "react";
import SubmitForm from "@/components/submit";

export const metadata: Metadata = {
  title: "Submit a Quib",
  description: "Create a new Quib on Quibble.",
};

export default function SubmitPage() {
  return (
    <Suspense>
      <SubmitForm />
    </Suspense>
  );
}
