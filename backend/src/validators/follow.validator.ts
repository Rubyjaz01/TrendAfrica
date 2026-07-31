import { z } from "zod";

export const followUserSchema = z.object({
  followingId: z
    .number()
    .int("User ID must be an integer")
    .positive("User ID must be greater than 0"),
});

export type FollowUserInput = z.infer<typeof followUserSchema>;