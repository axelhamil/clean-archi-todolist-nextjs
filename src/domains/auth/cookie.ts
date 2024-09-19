import { z } from "zod";

import { env } from "@/common/env";

export const cookieAttributesSchema = z.object({
  domain: z.string().optional(),
  expires: z.date().optional(),
  httpOnly: z.boolean().optional(),
  maxAge: z.number().optional(),
  path: z.string().optional(),
  sameSite: z.enum(["lax", "strict", "none"]).optional(),
  secure: z.boolean().default(env.NODE_ENV === "production"),
});
export const cookieSchema = z.object({
  attributes: cookieAttributesSchema,
  name: z.string(),
  value: z.string(),
});

export type Cookie = z.infer<typeof cookieSchema>;
export type CookieAttributes = z.infer<typeof cookieAttributesSchema>;
