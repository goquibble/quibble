import type { Nullable } from "./generics";

export interface Quib {
  upvotes: number;
  downvotes: number;
  user_vote_value: Nullable<number>;
  comments_count: number;
  quiblet: {
    id: number;
    name: string;
    avatar: Nullable<string>;
  };
  poster: {
    id: number;
    username: string;
    name: Nullable<string>;
    avatar: Nullable<string>;
  };
  id: string;
  slug: string;
  title: string;
  cover: Nullable<string>;
  cover_small: Nullable<string>;
  content: Nullable<string>;
  created_at: string;
}

export interface HighlightedQuib {
  upvotes: number;
  id: string;
  slug: string;
  title: string;
  cover_small: Nullable<string>;
}
