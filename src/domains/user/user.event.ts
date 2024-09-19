import { z } from "zod";

import { userWithoutPasswordSchema } from "@/src/domains/user/user.entity";
import { domainEventSchema } from "@/src/shared/events/domainEvent";

export const userCreatedEventSchema = domainEventSchema.extend({
  payload: userWithoutPasswordSchema,
  timestamp: z
    .date()
    .optional()
    .default(() => new Date()),
  type: z.literal("USER_CREATED").default("USER_CREATED"),
});

export type UserCreatedEvent = z.infer<typeof userCreatedEventSchema>;
