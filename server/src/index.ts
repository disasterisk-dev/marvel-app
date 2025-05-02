import { Elysia, t } from "elysia";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import swagger from "@elysiajs/swagger";
import { charactersRoute } from "./routes/character";
import { entriesRoute } from "./routes/entries";
import staticPlugin from "@elysiajs/static";
import { episodesRoute } from "./routes/episodes";
import cors from "@elysiajs/cors";
import { aboutRoute } from "./routes/about";
import { uploadRoute } from "./routes/upload";

const client = createClient({
  url: process.env.DB_URL!,
  authToken: process.env.DB_TOKEN!,
});

export const db = drizzle({ client });

export interface entryBrief {
  id: number;
  title: string;
  releaseDate: string;
  runtime: number | null;
  medium: string;
}

export const app = new Elysia()
  .use(
    cors({
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .use(staticPlugin())
  .use(
    swagger({
      path: "/",
      documentation: {
        info: {
          title: "Disasterisk's Marvel API Documentation",
          description:
            "This web API provides details for the entire release history of the Marvel Cinematic Universe. Characters are included for filtering purposes.",
          version: "0.1",
        },
      },
      scalarConfig: {
        favicon: "/public/favicon.png",
      },
    })
  )
  .use(aboutRoute)
  .use(entriesRoute)
  .use(charactersRoute)
  .use(episodesRoute)
  .use(uploadRoute)

  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
