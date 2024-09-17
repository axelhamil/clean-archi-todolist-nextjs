import { z } from "zod";

export const domainEventSchema = z.object({
  id: z.string(),
  payload: z.unknown(),
  timestamp: z
    .date()
    .optional()
    .default(() => new Date()),
  type: z.string(),
});
export type DomainEvent = z.infer<typeof domainEventSchema>;
