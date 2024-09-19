import { z } from "zod";

import { entitySchema } from "@/src/shared/entity";

export const sessionSchema = entitySchema.extend({
  expiresAt: z.date(),
  userId: z.string().uuid(),
});

export type Session = z.infer<typeof sessionSchema>;
