import { z } from "zod";

export const updateProfileSchema = z.object({
  username: z.string().min(3).max(30).optional(),
  bio: z.string().max(300).optional(),
  avatar: z.string().url().optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;