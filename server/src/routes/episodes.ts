import bearer from "@elysiajs/bearer";
import { Elysia, t } from "elysia";
import { db } from "..";
import { episodes, episodeSchema } from "../db/episodeSchema";
import { entries } from "../db/entrySchema";
import { and, eq } from "drizzle-orm";

export const episodesRoute = new Elysia({ prefix: "/episodes" })
  .use(bearer())
  .get(
    "/",
    // @ts-expect-error - not a fan of the schema
    async () => {
      const episodeList = await db.select().from(episodes).all();

      return {
        status: 200,
        retrievedAt: new Date(),
        count: episodeList.length,
        items: episodeList,
      };
    },
    {
      response: {
        200: t.Object({
          status: t.Number(),
          retrievedAt: t.Date(),
          count: t.Number(),
          items: t.Array(t.Omit(episodeSchema, [])),
        }),
      },
    }
  )
  .get("/:id", ({ params }) => {
    // Returns a single episode by the ID
    // Not sure this is useful or necessary
  })
  .get(
    "/from/:id",
    // @ts-ignore - doesn't like params
    async ({ params, error }) => {
      // const series = await db
      //   .select()
      //   .from(entries)
      //   .where(and(eq(entries.medium, "Show"), eq(entries.id, params.id)));

      const episodeList = await db
        .select()
        .from(episodes)
        .where(eq(episodes.series, params.id));

      // if (episodeList.length === 0) {
      //   return error(404, {
      //     status: 404,
      //     error: "No episodes",
      //   });
      // }

      return {
        status: 200,
        retrievedAt: new Date(),
        count: episodeList.length,
        items: episodeList,
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
          count: t.Number(),
          items: t.Array(t.Omit(episodeSchema, [])),
        }),
        404: t.Object({
          status: t.Number(),
          error: t.String(),
        }),
      },
    }
  )
  .post(
    "/",
    async ({ body, bearer, error }) => {
      // Limits posting to those who have a key
      if (bearer !== process.env.API_BEARER) {
        return error(401, {
          status: 401,
          error: "Not authorised to create episodes",
        });
      }

      // Used to remove " from episode names as they are included on Wikipedia
      // query.title = query.title.replaceAll('"', "");

      try {
        await db.insert(episodes).values(body);
      } catch (e) {
        return error(400, {
          status: 400,
          error: e?.toString(),
        });
      }

      return {
        status: 201,
        success: "Created new episode",
      };
    },
    {
      body: t.Omit(episodeSchema, ["id"]),
      response: {
        201: t.Object({
          status: t.Number({
            default: 201,
          }),
          success: t.String({
            default: "Created a new  episode.",
          }),
        }),
        400: t.Object({
          status: t.Number({
            default: 400,
          }),
          error: t.Optional(
            t.String({
              default: "Could not create new episode.",
            })
          ),
        }),
        401: t.Object({
          status: t.Number({
            default: 401,
          }),
          error: t.String({
            default: "Not authorised to create episodes.",
          }),
        }),
      },
    }
  )
  .put(
    "/:id",
    // @ts-expect-error - Doesn't like the schema
    async ({ params, body, error, bearer }) => {
      if (bearer !== process.env.API_BEARER) {
        console.log(bearer);
        return error(401, {
          status: 401,
          error: "Not authorised to edit entries.",
        });
      }

      try {
        await db.update(episodes).set(body).where(eq(episodes.id, params.id));

        return {
          status: 200,
          success: "Updated episode",
        };
      } catch {
        error(400, {
          status: 400,
          error: "Could not edit episode",
        });
      }
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
      body: t.Omit(episodeSchema, ["id"]),
      response: {
        200: t.Object({
          status: t.Number(),
          success: t.String(),
        }),
        400: t.Object({
          status: t.Number(),
          error: t.String(),
        }),
        401: t.Object({
          status: t.Number(),
          error: t.String(),
        }),
      },
    }
  );
