import bearer from "@elysiajs/bearer";
import { Elysia, t } from "elysia";
import { db } from "..";
import { episodes } from "../db/schema";

export const episodesRoute = new Elysia({ prefix: "/episodes" })
  .use(bearer())
  .get("/:id", ({ params }) => {
    // Returns a single episode by the ID
  })
  .get("/from/:id", ({ params }) => {
    // gets episodes from a specific show, via the show ID
  })
  .post(
    "/",
    async ({ query, bearer, error }) => {
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
        await db.insert(episodes).values(query);
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
      query: t.Object({
        title: t.String(),
        releaseDate: t.Date(),
        directors: t.Array(t.String()),
        runtime: t.Number(),
        series: t.Number(),
        episodeNumber: t.Number(),
      }),
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
  );
