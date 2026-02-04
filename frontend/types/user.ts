import type { Nullable } from "./generics";

export interface UserProfile {
  id: string;
  username: string;
  avatar: Nullable<string>;
}
