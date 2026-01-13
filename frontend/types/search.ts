import type { Nullable } from "./generics";

interface SearchQuiblet {
  id: number;
  name: string;
  avatar: Nullable<string>;
  members_count: number;
}

interface SearchProfile {
  id: number;
  username: string;
  name: Nullable<string>;
  avatar: Nullable<string>;
}

export interface Search {
  quiblets: Array<SearchQuiblet>;
  profiles: Array<SearchProfile>;
}
