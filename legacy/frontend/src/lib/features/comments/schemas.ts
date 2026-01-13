import { z } from 'zod';

export const CommentCreateSchema = z.object({
  path: z.string().optional(),
  content: z.string().min(1, 'Comment cannot be empty.')
});
