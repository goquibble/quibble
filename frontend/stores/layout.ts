import { create } from "zustand";
import { persist } from "zustand/middleware";

type LayoutType = "card" | "compact";

interface LayoutState {
  layout: LayoutType;
  setLayout: (layout: LayoutType) => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      layout: "card",
      setLayout: (layout) => set({ layout }),
    }),
    {
      name: "quib-layout-storage",
    },
  ),
);
