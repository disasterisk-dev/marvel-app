import { Elysia, t } from "elysia";
import { bearer } from "@elysiajs/bearer";
import { db } from "..";
import { entries } from "../db/entrySchema";
import { eq } from "drizzle-orm";
import { characters, characterSchema } from "../db/characterSchema";

// Type instantiation too deep/infinite error
// @ts-ignore
export const charactersRoute = new Elysia({ prefix: "/characters" })
  .use(bearer())
  .get(
    "/",
    async () => {
      const data = await db
        .select({
          id: characters.id,
          name: characters.name,
        })
        .from(characters)
        .all();

      return {
        status: 200,
        retrievedAt: new Date(),
        count: data.length,
        items: data,
      };
    },
    {
      response: {
        200: t.Object({
          status: t.Number(),
          retrievedAt: t.Date(),
          count: t.Number(),
          items: t.Array(t.Omit(characterSchema, ["actors"])),
        }),
      },
      detail: {
        description:
          "Return all characters, these are fairly empty, but useful for filtering the entries.",
      },
    }
  )
  .get(
    "/:id",
    async ({ params }) => {
      const chars = await db
        .select({
          id: characters.id,
          name: characters.name,
        })
        .from(characters)
        .where(eq(characters.id, params.id));

      // Getting all entries and filter later as SQLite does not have great support for arrays
      const entryList = await db
        .select({
          id: entries.id,
          title: entries.title,
          releaseDate: entries.releaseDate,
          characters: entries.characters,
        })
        .from(entries)
        .all();

      // Filtering out entries where the selected character is not listed
      const appearances = entryList.filter((e) =>
        // @ts-ignore
        Array.from(e.characters).includes(params.id)
      );

      // Removing character list from entry, can be queried separately as needed
      appearances.forEach((a) => {
        delete a.characters;
      });

      return {
        status: 200,
        retrievedAt: new Date(),
        data: chars[0],
      };
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
      response: {
        200: t.Object({
          status: t.Number(),
          retrievedAt: t.Date(),
          data: t.Omit(characterSchema, ["actors"]),
        }),
      },
      detail: {
        description:
          "Return a single character, along with any projects they appear in.",
      },
    }
  )
  .post(
    "/",
    // @ts-ignore
    async ({ bearer, body, error }) => {
      if (bearer !== process.env.API_BEARER) {
        return error(401, {
          status: 401,
          message: "Not authorised to create characters.",
        });
      }

      try {
        await db.insert(characters).values(body);
      } catch (e) {
        return error(400, {
          status: 400,
          error: e?.toString(),
        });
      }

      return {
        status: 201,
        message: "Created new character",
      };
    },
    {
      body: t.Omit(characterSchema, ["id"]),
      response: {
        201: t.Object({
          status: t.Number({
            default: 201,
          }),
          message: t.String({
            default: "Created a new character.",
          }),
        }),
        400: t.Object({
          status: t.Number({
            default: 400,
          }),
          message: t.Optional(
            t.String({
              default: "Could not create new character.",
            })
          ),
        }),
        401: t.Object({
          status: t.Number({
            default: 401,
          }),
          message: t.String({
            default: "Not authorised to create characters.",
          }),
        }),
      },
      detail: {
        description:
          "Create a new character to be used as a filter for media entries. NOT PUBLICLY ACCESSIBLE",
      },
    }
  );
