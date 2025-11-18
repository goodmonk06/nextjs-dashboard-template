import { z } from "zod";

export const updatePreferencesSchema = z.object({
  theme: z.enum(["dark", "light", "auto"]).optional(),
  language: z.string().min(2).max(5).optional(),
  timezone: z.string().optional(),
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  weeklyDigest: z.boolean().optional(),
  dashboardLayout: z.record(z.any()).optional(),
  customSettings: z.record(z.any()).optional(),
});

export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>;
