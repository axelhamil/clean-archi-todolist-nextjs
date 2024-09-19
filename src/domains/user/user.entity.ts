import { z } from "zod";

import { entitySchema } from "@/src/shared/entity";

export const userSchema = entitySchema.extend({
  email: z.string().email(),
  password: z.string(),
});
export const userWithoutPasswordSchema = userSchema.omit({
  password: true,
});
export const insertUserSchema = userSchema.pick({
  email: true,
  password: true,
});

export type User = z.infer<typeof userSchema>;
export type UserWithoutPassword = z.infer<typeof userWithoutPasswordSchema>;
export type UserInsert = z.infer<typeof insertUserSchema>;
