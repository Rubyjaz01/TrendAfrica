import { z } from "zod";

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters long"),

  email: z
    .string()
    .email("Please provide a valid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
});

export type RegisterInput = z.infer<typeof registerSchema>;