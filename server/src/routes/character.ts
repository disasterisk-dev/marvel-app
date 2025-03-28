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
    // @ts-ignore
    async ({ params }) => {
      const char = await db
        .select()
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
        data: {
          ...char[0],
          appearances: appearances.length,
          entries: appearances,
        },
      };
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
      response: {
        200: t.Object({
          status: t.Number({
            default: 200,
          }),
          retrievedAt: t.Date({
            default: new Date(),
          }),
          data: t.Object({
            id: t.Number(),
            name: t.String({
              default: "Iron Man",
            }),
            actors: t.Array(
              t.String({
                default: ["Rober Downey Jr."],
              })
            ),
            appearances: t.Number({
              default: 11,
            }),
            entries: t.Array(
              t.Object({
                id: t.Number({
                  default: 1,
                }),
                title: t.String({
                  default: "Iron Man",
                }),
                releaseDate: t.Date({
                  default: new Date(),
                }),
              })
            ),
          }),
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
    async ({ bearer, query, error }) => {
      if (bearer !== process.env.API_BEARER) {
        return error(401, {
          status: 401,
          error: "Not authorised to create characters.",
        });
      }

      try {
        await db.insert(characters).values(query);
      } catch (e) {
        return error(400, {
          status: 400,
          error: e?.toString(),
        });
      }

      return new Response("Created new character", { status: 201 });
    },
    {
      query: t.Object({
        name: t.String(),
        actors: t.Array(t.String()),
      }),
      response: {
        201: t.Object({
          status: t.Number({
            default: 201,
          }),
          success: t.String({
            default: "Created a new character.",
          }),
        }),
        400: t.Object({
          status: t.Number({
            default: 400,
          }),
          error: t.Optional(
            t.String({
              default: "Could not create new character.",
            })
          ),
        }),
        401: t.Object({
          status: t.Number({
            default: 401,
          }),
          error: t.String({
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
