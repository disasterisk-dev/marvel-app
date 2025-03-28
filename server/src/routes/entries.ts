import bearer from "@elysiajs/bearer";
import { Elysia, t } from "elysia";
import { entries } from "../db/schema";
import { db, entryBrief } from "..";

export const entriesRoute = new Elysia({ prefix: "/entries" })
  .use(bearer())
  .get(
    "/",
    // @ts-ignore
    async ({ error }) => {
      const data = await db
        .select({
          id: entries.id,
          title: entries.title,
          releaseDate: entries.releaseDate,
          runtime: entries.runtime,
          medium: entries.medium,
        })
        .from(entries)
        .all();

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
    },
    {
      response: {
        200: t.Object({
          status: t.Number({
            default: 200,
          }),
          retrievedAt: t.Date(),
          count: t.Number(),
          data: t.Array(
            t.Object({
              id: t.Number({
                description:
                  "The numerical ID assigned to the entry. Not sequential to release order, use releaseDate for that.",
                default: "5",
              }),
              title: t.String({
                description: "The title of the movie, show, or extra material",
                default: "Iron Man",
              }),
              releaseDate: t.Date({
                description:
                  "The date of the original premier in ISO standard format. All times default to midnight.",
              }),
              medium: t.UnionEnum(["Movie", "Show", "Extra"], {
                description:
                  "The format of the project. One Shots, web series and Disney+ special presentations are all Extras.",
              }),
              runtime: t.Nullable(
                t.Number({
                  description:
                    "How long is the piece? Not listed on shows but available by querying the ID with the /show end point.",
                })
              ),
            })
          ),
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
      query: t.Object({
        title: t.String({
          description: "The title of the movie or show",
        }),
        releaseDate: t.String({
          description:
            "Date of the original premiere. Use this format: YYYY-MM-DD",
        }),
        directors: t.Array(
          t.String({
            description:
              "For shows this refers to the showrunner(s). Directors of individual episodes are addressed in the episode entry.",
          })
        ),
        writers: t.Optional(
          t.Array(
            t.String({
              description:
                "Writers should be left blank for shows, instead the writers should be included on individual episodes.",
            })
          )
        ),
        medium: t.UnionEnum(["Movie", "Show", "Extra"], {
          description:
            "One Shots, web series and Disney+ special presentations are all Extras.",
        }),
        runtime: t.Optional(
          t.Number({
            description:
              "Leave blank for shows, its counted by individual episodes.",
          })
        ),
        posterUrl: t.String({
          description:
            "More accurately the file name of the poster as stored in the repository.",
        }),
        characters: t.Optional(
          t.Array(t.Number(), {
            description:
              "Numerical IDs for characters stored on the DB. Characters don't get an entry unless they are in varied enough projects to be a useful filter.",
          })
        ),
        phase: t.Number({
          description: "Which era of the MCU did this project come out in?",
        }),
      }),
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
