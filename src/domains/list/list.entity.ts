import { z } from "zod";

import { entitySchema } from "@/src/shared/entity";

export const listSchema = entitySchema.extend({
  name: z.string(),
  userId: z.string(),
});
export const insertListSchema = listSchema.pick({
  name: true,
  userId: true,
});

export type List = z.infer<typeof listSchema>;
export type ListInsert = z.infer<typeof insertListSchema>;
