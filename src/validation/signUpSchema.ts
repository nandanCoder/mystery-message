import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(3, "username must be at least 3 characters")
  .max(20, "username must be at most 20 characters")
  .regex(/^[a-zA-Z0-9]+$/, "username must only contain letters and numbers");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
