import bearer from "@elysiajs/bearer";
import { Elysia, t } from "elysia";

export const entriesRoute = new Elysia({ prefix: "/entries" })
  // @ts-ignore
  .use(bearer())
  .get(
    "/",
    () => {
      // Return all entries
    },
    {
      detail: {
        description:
          "Returns all entries, including movies, Disney+, Netflix, and TV shows, One Shots and extras",
      },
    }
  )
  .post(
    "/",
    async ({ bearer, query }) => {
      if (bearer !== "test") {
        return { text: "fail" };
      }

      return query;
    },
    {
      bearer: t.String(),
      query: t.Object({
        title: t.String({
          description: "test",
        }),
        release_date: t.String({ format: "date-time" }),
        directors: t.Array(t.String()),
        runtime: t.Optional(t.Number()),
        poster_url: t.String({
          format: "uri",
        }),
        characters: t.Array(t.String()),
      }),
      detail: {
        description: "Create a new media entries. NOT PUBLICLY ACCESSIBLE",
      },
    }
  );
