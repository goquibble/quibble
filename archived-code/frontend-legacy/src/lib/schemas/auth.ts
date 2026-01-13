import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.')
});

export const RegisterSchema = z
  .object({
    email: z.string().email('Please enter a valid email address.'),
    password1: z.string().min(8, 'Password must be at least 8 characters long.'),
    password2: z.string().min(8, 'Password must be at least 8 characters long.')
  })
  .refine((data) => data.password1 === data.password2, {
    message: `Passwords don't match.`,
    path: ['password2']
  });

export const VerificationCodeSchema = z.object({
  code: z.string().min(1, 'Verification code is required.').max(6, 'Invalid verification code.')
});

export const ProfileCreateSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters long.'),
  avatar: z
    .instanceof(File)
    .refine((f) => f.size < 5_000_000, 'Max 5 MB upload size.')
    .optional(),
  cover: z
    .instanceof(File)
    .refine((f) => f.size < 5_000_000, 'Max 5 MB upload size.')
    .optional()
});
