import { Elysia, t } from "elysia";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import swagger from "@elysiajs/swagger";
import { charactersRoute } from "./routes/character";
import { moviesRoute } from "./routes/movies";
import { entriesRoute } from "./routes/entries";

const client = createClient({
  url: process.env.DB_URL!,
  authToken: process.env.DB_TOKEN!,
});

export const db = drizzle({ client });

const app = new Elysia()
  .use(
    swagger({
      path: "/docs",
      documentation: {
        info: {
          title: "Disasterisk's Marvel API Documentation",
          description:
            "This web API provides details for the entire release history of the Marvel Cinematic Universe. Characters are included for filtering purposes.",
          version: "0.1",
        },
      },
    })
  )
  .use(entriesRoute)
  .use(moviesRoute)
  .use(charactersRoute)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
