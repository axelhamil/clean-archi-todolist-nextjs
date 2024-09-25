import { loadEnvConfig } from "@next/env";
import { z } from "zod";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const envSchema = z.object({
  CODECOV_TOKEN: z.string().optional(),
  DATABASE_URL: z.string(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  NODE_ENV: z.string().default("development"),
  PORT: z.string().default("3000"),
  SENTRY_AUTH_TOKEN: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
