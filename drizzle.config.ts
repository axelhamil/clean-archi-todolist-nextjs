import { defineConfig, type Config } from "drizzle-kit";
import "./envConfig";

export default defineConfig({
  dialect: "postgresql",
  schema: "./drizzle/schemas.ts",
  out: "./drizzle/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
}) satisfies Config;