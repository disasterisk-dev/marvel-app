import bearer from "@elysiajs/bearer";
import { Elysia, t } from "elysia";
import { entries } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { db, entryBrief } from "..";

export const moviesRoute = new Elysia({ prefix: "/movies" })
  .get(
    "/",
    // @ts-ignore
    async () => {
      const data = await db
        .select({
          id: entries.id,
          title: entries.title,
          releaseDate: entries.releaseDate,
          runtime: entries.runtime,
          medium: entries.medium,
        })
        .from(entries)
        .where(eq(entries.medium, "Movie"));

      let body = {
        status: 200,
        retrievedAt: new Date(),
        count: data.length,
        data: data,
      };

      return body;
    },
    {
      response: t.Object({
        status: t.Number({ description: "Was the response okay?" }),
        retrievedAt: t.Date({
          description: "Time the response is sent to the client.",
        }),
        count: t.Number({ description: "The number of entries returned" }),
        data: t.Array(
          t.Object({
            id: t.Number({
              description:
                "The numerical ID assigned to the entry. Not sequential to release order, use releaseDate for that.",
            }),
            title: t.String({
              description: "The title of the movie, show, or extra material",
              default: "Iron Man",
            }),
            releaseDate: t.Date({
              description:
                "The date of the original premiere in standard ISO format.",
            }),
            runtime: t.Number({
              description:
                "How long is the piece? Not listed on shows but available by querying the ID with the /show end point.",
            }),
            medium: t.UnionEnum(["Movie", "Show", "Extra"]),
          })
        ),
      }),
      detail: {
        description: "Retrieve all movies.",
      },
    }
  )
  .get(
    "/:id",
    // @ts-ignore
    async ({ params, error }) => {
      const data = await db
        .select()
        .from(entries)
        .where(and(eq(entries.medium, "Movie"), eq(entries.id, params.id)));

      if (data.length === 0) {
        return error(404, {
          status: 404,
          error: "Could not find movie with that ID",
        });
      }

      data[0].posterUrl = process.env.BASE_URL + "/public" + data[0].posterUrl;

      return {
        status: 200,
        retrievedAt: new Date(),
        data: data[0],
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
            title: t.String({
              default: "Iron Man",
            }),
            releaseDate: t.Date({
              format: "date-time",
              default: new Date(),
            }),
            directors: t.Array(t.String()),
            writers: t.Array(t.String()),
            medium: t.UnionEnum(["Movie", "Show", "Extra"]),
            runtime: t.Number({
              default: 126,
            }),
            posterUrl: t.String({
              format: "uri",
            }),
            characters: t.Array(t.Number()),
            phase: t.Number(),
          }),
        }),
        404: t.Object({
          status: t.Number(),
          error: t.String({
            default: "Could not find movie with that ID",
          }),
        }),
      },
      detail: {
        description:
          "Use this to pull a single movie based on ID. IDs are plain numbers.",
      },
    }
  )
  .get("/q/:qString", () => {
    // Query for specific string in title, characters, directors
  });
