import bearer from "@elysiajs/bearer";
import { Elysia, t } from "elysia";
import { entries, entrySelectSchema } from "../db/entrySchema";
import { app, db, entryBrief } from "..";
import { eq } from "drizzle-orm";

export const entriesRoute = new Elysia({ prefix: "/entries" })
  .use(bearer())
  .get(
    "/",
    // Type error being thrown as null & undefined can't be reconciled with the entry schema's MEDIUM property
    // @ts-ignore
    async ({ error, query }) => {
      // Check if user has passed the optional medium query
      if (query.medium) {
        const data = await db
          .select({
            id: entries.id,
            title: entries.title,
            releaseDate: entries.releaseDate,
            runtime: entries.runtime,
            medium: entries.medium,
          })
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
          data: data,
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
  .get("/:id", ({ params }) => {
    // get entry by ID
  })
  .post(
    "/",
    async ({ bearer, query, error }) => {
      if (bearer !== process.env.API_BEARER) {
        return error(401, {
          status: 401,
          error: "Not authorised to create entries.",
        });
      }

      // Throws an error due to the Elysia validation but is converted by Drizzle anyway
      // @ts-ignore
      query.releaseDate = new Date(query.releaseDate);

      try {
        // Throws an error due to Elysia validation
        // @ts-ignore
        await db.insert(entries).values(query);
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
      query: t.Omit(entrySelectSchema, ["id"]),
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
  );
