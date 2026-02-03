import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Nullable } from "@/types/generics";

export interface RecentQuib {
  id: number | string;
  quiblet: {
    name: string;
    avatar: string;
  };
  title: string;
  slug: string;
  cover: Nullable<string>;
  upvotes: number;
  comments: number;
  visitedAt: number;
}

export interface RecentQuiblet {
  name: string;
  avatar: string;
  isStarred: boolean;
  visitedAt: number;
}

interface UserRecentData {
  quibs: RecentQuib[];
  quiblets: RecentQuiblet[];
}

interface RecentStore {
  data: Record<string, UserRecentData>;

  // Actions
  addRecentQuib: (
    username: string,
    quib: Omit<RecentQuib, "visitedAt">,
  ) => void;
  addRecentQuiblet: (
    username: string,
    quiblet: Omit<RecentQuiblet, "visitedAt" | "isStarred">,
  ) => void;
  toggleFavoriteQuiblet: (username: string, quibletName: string) => void;
  clearRecentQuibs: (username: string) => void;

  // Selectors (helpers)
  getRecentQuibs: (username: string) => RecentQuib[];
  getRecentQuiblets: (username: string) => RecentQuiblet[];
}

const MAX_RECENT_ITEMS = 10;

export const useRecentStore = create<RecentStore>()(
  persist(
    (set, get) => ({
      data: {},

      addRecentQuib: (username, quib) =>
        set((state) => {
          const userData = state.data[username] || { quibs: [], quiblets: [] };
          // Remove if exists (to move to top)
          const filtered = userData.quibs.filter((q) => q.id !== quib.id);
          // Add to front
          const newQuibs = [
            { ...quib, visitedAt: Date.now() },
            ...filtered,
          ].slice(0, MAX_RECENT_ITEMS);

          return {
            data: {
              ...state.data,
              [username]: { ...userData, quibs: newQuibs },
            },
          };
        }),

      addRecentQuiblet: (username, quiblet) =>
        set((state) => {
          const userData = state.data[username] || { quibs: [], quiblets: [] };
          // Check if exists to preserve isStarred status
          const existing = userData.quiblets.find(
            (q) => q.name === quiblet.name,
          );
          const isStarred = existing ? existing.isStarred : false;

          const filtered = userData.quiblets.filter(
            (q) => q.name !== quiblet.name,
          );

          const newQuiblets = [
            { ...quiblet, isStarred, visitedAt: Date.now() },
            ...filtered,
          ].slice(0, MAX_RECENT_ITEMS * 2); // Keep more in case of pins? Or just keep it simple.
          // Note: if we limit to 10, and we have 10 pinned items, adding a new one might be tricky.
          // For now let's just slice.

          return {
            data: {
              ...state.data,
              [username]: { ...userData, quiblets: newQuiblets },
            },
          };
        }),

      toggleFavoriteQuiblet: (username, quibletName) =>
        set((state) => {
          const userData = state.data[username];
          if (!userData) return state;

          const newQuiblets = userData.quiblets.map((q) =>
            q.name === quibletName ? { ...q, isStarred: !q.isStarred } : q,
          );

          return {
            data: {
              ...state.data,
              [username]: { ...userData, quiblets: newQuiblets },
            },
          };
        }),

      clearRecentQuibs: (username) =>
        set((state) => {
          const userData = state.data[username];
          if (!userData) return state;
          return {
            data: {
              ...state.data,
              [username]: { ...userData, quibs: [] },
            },
          };
        }),

      getRecentQuibs: (username) => {
        const state = get();
        return state.data[username]?.quibs || [];
      },

      getRecentQuiblets: (username) => {
        const state = get();
        const quiblets = state.data[username]?.quiblets || [];
        // Sort: Starred first, then by visitedAt descending
        return [...quiblets].sort((a, b) => {
          if (a.isStarred === b.isStarred) {
            return b.visitedAt - a.visitedAt;
          }
          return a.isStarred ? -1 : 1;
        });
      },
    }),
    {
      name: "recent-items-storage",
    },
  ),
);
