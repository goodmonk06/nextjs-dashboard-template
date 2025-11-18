import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "editor", "viewer"]).default("viewer"),
  status: z.enum(["active", "pending", "inactive"]).default("active"),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(100).optional(),
  email: z.string().email("Invalid email address").optional(),
  role: z.enum(["admin", "editor", "viewer"]).optional(),
  status: z.enum(["active", "pending", "inactive"]).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
