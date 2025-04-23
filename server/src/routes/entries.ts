import bearer from "@elysiajs/bearer";
import { Elysia, t } from "elysia";
import { entries, entrySelectSchema } from "../db/entrySchema";
import { app, db, entryBrief } from "..";
import { eq } from "drizzle-orm";
import { episodes } from "../db/episodeSchema";

export const entriesRoute = new Elysia({ prefix: "/entries" })
  .use(bearer())
  .get(
    "/",
    // @ts-expect-error Type error being thrown as null & undefined can't be reconciled with the entry schema's MEDIUM property
    async ({ error, query }) => {
      // Check if user has passed the optional medium query
      if (query.medium) {
        const data = await db
          .select()
          .from(entries)
          .where(eq(entries.medium, query.medium));

        if (data === null)
          return error(400, {
            status: 400,
            error: "Something went wrong",
          });

        return {
          status: 200,
          retrievedAt: new Date(),
          count: data.length,
          items: data,
        };
      }

      // if no query return all
      const data = await db.select().from(entries).all();

      if (data === null)
        return error(400, {
          status: 400,
          error: "Something went wrong",
        });

      data.forEach((e) => {
        e.posterUrl = `http://${app.server?.hostname}:${app.server?.port}/public/${e.posterUrl}`;
      });

      return {
        status: 200,
        retrievedAt: new Date(),
        count: data.length,
        items: data,
      };
    },
    {
      query: t.Object({
        medium: t.Optional(t.UnionEnum([null, "Movie", "Show", "Extra"])),
      }),
      response: {
        200: t.Object({
          status: t.Number({
            default: 200,
          }),
          retrievedAt: t.Date(),
          count: t.Number(),
          items: t.Array(t.Omit(entrySelectSchema, [])),
        }),
        400: t.Object({
          status: t.Number({
            default: 400,
          }),
          error: t.String({
            default: "Something went wrong",
          }),
        }),
      },
      detail: {
        description:
          "Returns minimal all entries, including movies, TV shows, One Shots and extras",
      },
    }
  )
  .get(
    "/:id",
    // @ts-expect-error - doesn't like the schema
    async ({ error, params }) => {
      // get entry by ID
      const entry = await db
        .select()
        .from(entries)
        .where(eq(entries.id, params.id))
        .then((values) => {
          return values[0];
        });

      if (!entry) {
        return error(404, {
          status: 404,
          error: "No entry found",
        });
      }

      if (entry.medium !== "Show") {
        return {
          status: 200,
          retrievedAt: new Date(),
          item: entry,
        };
      }

      const episodeList = await db
        .select({ runtime: episodes.runtime })
        .from(episodes)
        .where(eq(episodes.series, params.id));

      let runtime = 0;
      episodeList.forEach((e) => (runtime += e.runtime));
      entry.runtime = runtime;

      return {
        status: 200,
        retrievedAt: new Date(),
        item: entry,
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
          item: t.Omit(entrySelectSchema, []),
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
    async ({ bearer, body, error }) => {
      if (bearer !== process.env.API_BEARER) {
        return error(401, {
          status: 401,
          error: "Not authorised to create entries.",
        });
      }

      // Throws an error due to the Elysia validation but is converted by Drizzle anyway
      // @ts-ignore
      body.releaseDate = new Date(body.releaseDate);
      body.runtime = body.runtime! <= 0 ? null : body.runtime;

      try {
        // Throws an error due to Elysia validation
        // @ts-ignore
        await db.insert(entries).values(body);
      } catch (e) {
        return error(400, {
          status: 400,
          error: e?.toString(),
        });
      }

      return {
        status: 201,
        success: "Created new entry",
      };
    },
    {
      body: t.Omit(entrySelectSchema, ["id"]),
      response: {
        201: t.Object({
          status: t.Number({
            default: 201,
          }),
          success: t.String({
            default: "Created new entry",
          }),
        }),
        400: t.Object({
          status: t.Number({
            default: 400,
          }),
          error: t.Optional(
            t.String({
              default: "Could not create new entry",
            })
          ),
        }),
        401: t.Object({
          status: t.Number({
            default: 401,
          }),
          error: t.String({
            default: "Not authorised to create entries",
          }),
        }),
      },
      detail: {
        description: "Create a new media entries. NOT PUBLICLY ACCESSIBLE",
      },
    }
  )
  .put(
    "/:id",
    async ({ params, body, error }) => {
      try {
        await db.update(entries).set(body).where(eq(entries.id, params.id));

        return {
          status: 202,
          success: "Updated " + body.title,
        };
      } catch {
        return error(400, {
          status: 400,
          error: "Could not update " + body.title,
        });
      }
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
      body: t.Omit(entrySelectSchema, ["id"]),
      response: {
        202: t.Object({
          status: t.Number(),
          success: t.String(),
        }),
        400: t.Object({
          status: t.Number(),
          error: t.String(),
        }),
      },
    }
  );
