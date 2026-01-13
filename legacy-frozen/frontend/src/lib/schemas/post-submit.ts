import { z } from 'zod';

const BasePostSubmitSchema = z.object({
  community: z.coerce
    .number({ invalid_type_error: 'Community must be selected.' })
    .min(1, 'Community must be selected.'),
  title: z
    .string({ required_error: 'Title cannot be empty.' })
    .min(1, 'Title cannot be empty.')
    .max(300),
  type: z.enum(['TEXT', 'IMAGE'])
});

const TextPostSubmitSchema = BasePostSubmitSchema.extend({
  type: z.literal('TEXT'),
  content: z
    .string({ required_error: 'Content cannot be empty.' })
    .min(1, 'Content cannot be empty.')
});

const ImagePostSubmitSchema = BasePostSubmitSchema.extend({
  type: z.literal('IMAGE'),
  cover: z
    .instanceof(File, { message: 'Please upload some media.' })
    .refine((f) => f.size < 5_000_000, 'Max 5 MB upload size.')
    .refine((f) => f.type.startsWith('image/'), 'Only image files are supported now.')
});

export const PostSubmitSchema = z.discriminatedUnion('type', [
  TextPostSubmitSchema,
  ImagePostSubmitSchema
]);
