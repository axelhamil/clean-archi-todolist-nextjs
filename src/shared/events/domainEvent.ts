import { z } from "zod";

import { Entity } from "@/src/shared/entity";
import { DomainError } from "@/src/shared/errors";
import { eventBus } from "@/src/shared/events/index";

export const domainEventSchema = z.object({
  id: z.string(),
  payload: z.any(),
  timestamp: z
    .date()
    .optional()
    .default(() => new Date()),
  type: z.string(),
});
export type DomainEvent = z.infer<typeof domainEventSchema>;
export const createDomainEvent = (
  entity: Entity,
  eventSchema: z.ZodSchema,
): void => {
  const { data, error: inputParseError } = eventSchema.safeParse({
    id: entity.id,
    payload: entity,
  });

  if (inputParseError)
    throw new DomainError("Invalid data", {
      cause: inputParseError.errors,
    });

  eventBus.addEvent(entity.id, data);
};
