import { Suspense } from "react";
import QuibLayoutSelector from "./quib-layout-selector";
import QuibSort from "./quib-sort";

export default function QuibHeader() {
  return (
    <div className="flex items-center justify-between">
      <Suspense>
        <QuibSort />
      </Suspense>
      <QuibLayoutSelector />
    </div>
  );
}
