import type { Nullable } from "./generics";

export interface Quiblet {
  has_joined: boolean;
  members_count: number;
  quibs_count: number;
  moderators: Array<{
    id: number;
    username: string;
    name: Nullable<string>;
    avatar: Nullable<string>;
  }>;
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

export interface QuibletBasic {
  id: number;
  name: string;
  avatar: Nullable<string>;
  members_count: number;
  is_favorite: boolean;
}
