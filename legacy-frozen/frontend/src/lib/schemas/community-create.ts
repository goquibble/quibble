import type { SuperFormData, SuperFormErrors } from 'sveltekit-superforms/client';
import { z } from 'zod';

export const CommunityCreateSchema = z.object({
  name: z
    .string()
    .min(1, 'Community name is required.')
    .regex(
      /^[a-zA-Z0-9](?:[a-zA-Z0-9_-]*[a-zA-Z0-9])?$/,
      'Only letters, numbers, _ and -, no special characters at the ends.'
    ),
  description: z.string().min(1, 'Description cannot be empty.'),
  avatar: z
    .instanceof(File)
    .refine((f) => f.size < 5_000_000, 'Max 5 MB upload size.')
    .optional(),
  banner: z
    .instanceof(File)
    .refine((f) => f.size < 5_000_000, 'Max 5 MB upload size.')
    .optional(),
  topics: z.number().array().min(1, 'Please select at least one topic.'),
  type: z.enum(['PRIVATE', 'RESTRICTED', 'PUBLIC']).default('PUBLIC'),
  nsfw: z.boolean().default(false)
});

export type CommunityCreateType = typeof CommunityCreateSchema;

export type CommunityCreateFormType = SuperFormData<z.infer<CommunityCreateType>>;
export type CommunityCreateErrorsType = SuperFormErrors<z.infer<CommunityCreateType>>;
