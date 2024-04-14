import { z } from "zod";

export const signInSchema = z.object({
  indentifire: z
    .string()
    .min(3, "Indentifire must be at least 3 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
