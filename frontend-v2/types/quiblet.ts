import type { Nullable } from "./generics";

export interface Quiblet {
  id: number;
  name: string;
  title: Nullable<string>;
  avatar: Nullable<string>;
  banner: Nullable<string>;
  description: string;
  type: "PUBLIC" | "RESTRICTED" | "PRIVATE";
  nfsw: boolean;
  created_at: string;
}
