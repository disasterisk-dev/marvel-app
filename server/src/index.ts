import { Elysia } from "elysia";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { entries } from "./db/schema";
import { eq } from "drizzle-orm";

const client = createClient({
  url: process.env.DB_URL!,
  authToken: process.env.DB_TOKEN!,
});

export const db = drizzle({ client });

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .get("/movies", async () => {
    const data = await db
      .select()
      .from(entries)
      .where(eq(entries.medium, "Movie"));

    return data;
  })
  .get("/movies/:id", async ({ params }) => {
    const data = await db
      .select()
      .from(entries)
      .where(eq(entries.id, parseInt(params.id)));

    return data[0];
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
