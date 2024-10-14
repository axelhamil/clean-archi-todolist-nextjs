import { z } from "zod";

import { entitySchema } from "@/src/shared/entity";

export const listSchema = entitySchema.extend({
  name: z.string(),
  userId: z.string(),
});
export const insertListSchema = listSchema.omit({
  createdAt: true,
  id: true,
  updatedAt: true,
});

export type List = z.infer<typeof listSchema>;
export type ListInsert = z.infer<typeof insertListSchema>;
