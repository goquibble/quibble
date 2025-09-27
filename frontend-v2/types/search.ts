import type { Nullable } from "./generics";

export interface Search {
  quiblets: Array<{
    id: number;
    name: string;
    avatar: Nullable<string>;
    members_count: number;
  }>;
}
