import type { components } from '$lib/api';
import type { Nullable } from './shared';

export type Comment = components['schemas']['Comment'];
export type CommentTree = Comment & { children: CommentTree[]; collapsed: boolean };

export type CommentOverview = Omit<Comment, 'commenter' | 'path'> & {
  commenter: string;
  reply_to: Nullable<string>;
  is_op: boolean;
  post: {
    id: number;
    title: string;
    slug: string;
    community: {
      name: string;
      avatar: Nullable<string>;
    };
  };
};
