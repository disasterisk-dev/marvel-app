import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: [
    "./src/db/characterSchema.ts",
    "./src/db/entrySchema.ts",
    "./src/db/episodeSchema.ts",
  ],
  dialect: "turso",
  dbCredentials: {
    url: process.env.DB_URL!,
    authToken: process.env.DB_TOKEN!,
  },
});
