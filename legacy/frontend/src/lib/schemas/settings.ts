import type { SuperFormData, SuperFormErrors } from 'sveltekit-superforms/client';
import { z } from 'zod';

export const ProfileSettingsSchema = z.object({
  username: z.string().trim().min(3, 'Username must be at least 3 characters long.').optional(),
  name: z.string().optional(),
  bio: z.string().optional(),
  avatar: z
    .instanceof(File)
    .refine((f) => f.size < 5_000_000, 'Max 5 MB upload size.')
    .optional(),
  banner: z
    .instanceof(File)
    .refine((f) => f.size < 5_000_000, 'Max 5 MB upload size.')
    .optional()
});

export type ProfileSettingsType = z.infer<typeof ProfileSettingsSchema>;
export type ProfileSettingsFormDataType = SuperFormData<z.infer<typeof ProfileSettingsSchema>>;
export type ProfileSettingsFormErrorsType = SuperFormErrors<z.infer<typeof ProfileSettingsSchema>>;
// props
export type ProfileSettingsProps = {
  form: ProfileSettingsFormDataType;
  errors: ProfileSettingsFormErrorsType;
};
