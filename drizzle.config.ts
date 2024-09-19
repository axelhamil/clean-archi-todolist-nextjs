import { type Config, defineConfig } from "drizzle-kit";

import { env } from "@/common/env";

export default defineConfig({
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
  dialect: "postgresql",
  out: "./common/db/migrations",
  schema: "./common/db/schemas.ts",
}) satisfies Config;
