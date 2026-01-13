import { z } from 'zod';

export const zod_required_string = (field: string) => {
  return z
    .string()
    .min(1, { message: `${field} is required` })
    .trim();
};
