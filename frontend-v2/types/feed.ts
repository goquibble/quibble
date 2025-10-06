import type { Nullable } from "./generics";

export interface FeedQuib {
  upvotes: number;
  downvotes: number;
  quiblet: {
    id: number;
    name: string;
    avatar: Nullable<string>;
  };
  id: string;
  slug: string;
  title: string;
  cover: Nullable<string>;
  cover_small: Nullable<string>;
  content: Nullable<string>;
}

export interface Feed {
  count: number;
  items: Array<FeedQuib>;
}
