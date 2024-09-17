import { z } from "zod";

import { env } from "@/libs/env";

export const cookieAttributesSchema = z.object({
  domain: z.string().optional(),
  expires: z.date().optional(),
  httpOnly: z.boolean().optional(),
  maxAge: z.number().optional(),
  path: z.string().optional(),
  sameSite: z.enum(["lax", "strict", "none"]).optional(),
  secure: z.boolean().default(env.NODE_ENV === "production"),
});
export type CookieAttributes = z.infer<typeof cookieAttributesSchema>;

export const cookieSchema = z.object({
  attributes: cookieAttributesSchema,
  name: z.string(),
  value: z.string(),
});
export type Cookie = z.infer<typeof cookieSchema>;
