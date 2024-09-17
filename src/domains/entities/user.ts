import { z } from "zod";

export const pointsSchema = z.number().int().nonnegative().default(0);
export type Points = z.infer<typeof pointsSchema>;

export const userSchema = z.object({
  createdAt: z.date().optional(),
  email: z.string().email(),
  id: z.string().uuid(),
  password: z.string(),
  points: pointsSchema,
  updatedAt: z.date().optional(),
});
export type User = z.infer<typeof userSchema>;

export const selectUserWithoutPasswordSchema = userSchema.omit({
  password: true,
});
export type UserWithoutPassword = z.infer<
  typeof selectUserWithoutPasswordSchema
>;

export const insertUserSchema = userSchema.pick({
  email: true,
  password: true,
});
export type UserInsert = z.infer<typeof insertUserSchema>;

export const winPointsSchema = (user: User, points: Points): User => {
  points = pointsSchema.parse(points);
  user = userSchema.parse(user);

  return userSchema.parse({
    ...user,
    points: user.points + points,
  });
};
