import { z } from "zod";

export const createPostSchema = z.object({
  content: z
    .string()
    .min(1, "Post content is required")
    .max(1000, "Post cannot exceed 1000 characters"),

  image: z
    .string()
    .url("Image must be a valid URL")
    .optional(),
});

export const updatePostSchema = createPostSchema.partial();

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;