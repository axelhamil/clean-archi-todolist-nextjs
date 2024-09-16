import { z } from "zod";

export const selectUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  password: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})
export type User = z.infer<typeof selectUserSchema>;

export const selectUserWithoutPasswordSchema = selectUserSchema.omit({
  password: true,
})
export type UserWithoutPassword = z.infer<typeof selectUserWithoutPasswordSchema>;

export const insertUserSchema = selectUserSchema.pick({
  email: true,
  password: true,
})
export type UserInsert = z.infer<typeof insertUserSchema>;