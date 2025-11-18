import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().max(500).optional(),
  plan: z.enum(["free", "pro", "enterprise"]).default("free"),
  status: z.enum(["active", "suspended", "archived"]).default("active"),
  settings: z.record(z.any()).optional(),
});

export const updateOrganizationSchema = z.object({
  name: z.string().min(1, "Name is required").max(100).optional(),
  slug: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  description: z.string().max(500).optional().nullable(),
  plan: z.enum(["free", "pro", "enterprise"]).optional(),
  status: z.enum(["active", "suspended", "archived"]).optional(),
  settings: z.record(z.any()).optional(),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
