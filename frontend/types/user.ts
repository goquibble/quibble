import type { Nullable } from "./generics";

export interface UserProfile {
  id: string;
  username: string;
  avatar_url: Nullable<string>;
}
