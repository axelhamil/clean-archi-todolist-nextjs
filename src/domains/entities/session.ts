import { z } from "zod";

export const sessionSchema = z.object({
  createdAt: z.date().optional(),
  expiresAt: z.date(),
  id: z.string().uuid(),
  updatedAt: z.date().optional(),
  userId: z.string().uuid(),
});

export type Session = z.infer<typeof sessionSchema>;
