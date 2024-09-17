import { type Config, defineConfig } from "drizzle-kit";

import { env } from "@/libs/env";

export default defineConfig({
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
  dialect: "postgresql",
  out: "./libs/drizzle/migrations",
  schema: "./libs/drizzle/schemas.ts",
}) satisfies Config;
