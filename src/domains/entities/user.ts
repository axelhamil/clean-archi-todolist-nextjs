import { z } from "zod";

export const selectUserSchema = z.object({
  createdAt: z.date().optional(),
  email: z.string().email(),
  id: z.string().uuid(),
  password: z.string(),
  updatedAt: z.date().optional(),
});
export type User = z.infer<typeof selectUserSchema>;

export const selectUserWithoutPasswordSchema = selectUserSchema.omit({
  password: true,
});
export type UserWithoutPassword = z.infer<
  typeof selectUserWithoutPasswordSchema
>;

export const insertUserSchema = selectUserSchema.pick({
  email: true,
  password: true,
});
export type UserInsert = z.infer<typeof insertUserSchema>;
