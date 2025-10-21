import type { Nullable } from "./generics";

export interface Comment {
  upvotes: number;
  downvotes: number;
  user_vote_value: Nullable<number>;
  commenter: Nullable<{
    id: number;
    username: string;
    name: Nullable<string>;
    avatar: Nullable<string>;
  }>;
  path: string;
  id: number;
  content: string;
  is_deleted: boolean;
  created_at: string;
}
