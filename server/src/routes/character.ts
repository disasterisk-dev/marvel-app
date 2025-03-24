import { Elysia, t } from "elysia";
import { bearer } from "@elysiajs/bearer";
import { db } from "..";
import { characters, entries } from "../db/schema";
import { eq } from "drizzle-orm";

export const charactersRoute = new Elysia({ prefix: "/characters" })
  .use(bearer())
  .get(
    "/",
    async () => {
      const data = await db.select().from(characters).all();

      return {
        count: data.length,
        items: data,
      };
    },
    {
      detail: {
        description:
          "Return all characters, these are fairly empty, but useful for filtering the entries.",
      },
    }
  )
  .get(
    "/:id",
    async ({ params }) => {
      const char = await db
        .select()
        .from(characters)
        .where(eq(characters.id, params.id));

      // Getting all entries and filter later as SQLite does not have great support for arrays
      const entryList = await db.select().from(entries).all();

      const appearances = entryList.filter((e) =>
        // @ts-ignore
        Array.from(e.characters).includes(params.id)
      );

      return {
        ...char[0],
        entries: appearances,
      };
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
      detail: {
        description:
          "Return a single character, along with any entries they appear in.",
      },
    }
  )
  .post(
    "/",
    // @ts-ignore
    async ({ bearer, query }) => {
      if (bearer !== process.env.API_BEARER) {
        return new Response("This endpoint is not public accessible", {
          status: 401,
        });
      }

      try {
        await db.insert(characters).values(query);
      } catch (error) {
        return new Response("Could not create the character", { status: 400 });
      }

      return new Response("Created new character", { status: 201 });
    },
    {
      query: t.Object({
        name: t.String(),
        actors: t.Array(t.String()),
      }),
      detail: {
        description:
          "Create a new character to be used as a filter for media entries. NOT PUBLICLY ACCESSIBLE",
        responses: {
          201: {
            description: "Created new character",
          },
          400: {
            description: "Could not create the character",
          },
          401: {
            description: "This endpoint is not public accessible",
          },
        },
      },
    }
  );
