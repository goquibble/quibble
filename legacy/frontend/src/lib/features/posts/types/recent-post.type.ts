interface Community {
  avatar?: string | null;
  name: string;
}

export interface RecentPost {
  id: string;
  community: Community;
  title: string;
  slug?: string;
  cover?: string | null;
  upvotes?: number[];
  comments?: number[];
}

export interface RecentPostWithTimestamp extends RecentPost {
  timestamp: Date;
}
