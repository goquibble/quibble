import { browser } from '$app/environment';
import type { RecentPost, RecentPostWithTimestamp } from '../types/recent-post.type';

// constants
const RECENT_POSTS_LS_KEY = 'recent_posts_store';

function get_stored_recent_posts(): RecentPostWithTimestamp[] {
  if (!browser) return [];
  try {
    const stored = localStorage.getItem(RECENT_POSTS_LS_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored) as RecentPostWithTimestamp[];
    return parsed.map((post) => ({
      ...post,
      timestamp: new Date(post.timestamp)
    }));
  } catch (err) {
    console.error('error while parsing stored recent posts: ', err);
    return [];
  }
}

function get_sorted_recent_posts(recent_posts: RecentPostWithTimestamp[]) {
  return [...recent_posts].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

function create_recent_posts_store() {
  let recent_posts = $state<RecentPostWithTimestamp[]>(get_stored_recent_posts());

  $effect.root(() => {
    $effect(() => {
      if (!browser || recent_posts.length <= 0) return;
      localStorage.setItem(
        RECENT_POSTS_LS_KEY,
        JSON.stringify(
          recent_posts.map((post) => ({
            ...post,
            timestamp: post.timestamp.toISOString() // convert Date object to string
          }))
        )
      );
    });
  });

  return {
    get value() {
      return recent_posts;
    },
    add_post(post: RecentPost) {
      if (recent_posts.some((p) => p.id === post.id)) return;
      recent_posts = get_sorted_recent_posts([
        ...recent_posts,
        {
          ...post,
          timestamp: new Date(Date.now())
        }
      ]);
    },
    clear() {
      recent_posts = [];
      // clear storage
      if (browser) localStorage.removeItem(RECENT_POSTS_LS_KEY);
    }
  };
}

// initialize store
export const recent_posts_store = create_recent_posts_store();
