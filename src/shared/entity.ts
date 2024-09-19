import { z } from "zod";

export const entitySchema = z.object({
  createdAt: z.date().optional(),
  id: z.string().uuid(),
  updatedAt: z.date().optional(),
});
export type Entity = z.infer<typeof entitySchema>;
