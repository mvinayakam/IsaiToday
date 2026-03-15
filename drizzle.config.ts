import type { Config } from "drizzle-kit";

export default {
  schema: "./shared/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  out: "./migrations",
} satisfies Config;
