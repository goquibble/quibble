import type { Nullable } from "./generics";

export interface UserProfile {
  id: number;
  username: string;
  avatar: Nullable<string>;
}
