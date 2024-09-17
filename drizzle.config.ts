import { type Config, defineConfig } from "drizzle-kit";

import { env } from "@/shared/env";

export default defineConfig({
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
  dialect: "postgresql",
  out: "./shared/db/migrations",
  schema: "./shared/db/schemas.ts",
}) satisfies Config;
