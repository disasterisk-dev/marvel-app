import bearer from "@elysiajs/bearer";
import { Elysia, t } from "elysia";
import { entries } from "../db/schema";
import { db } from "..";

export const entriesRoute = new Elysia({ prefix: "/entries" })
  .use(bearer())
  .get(
    "/",
    () => {
      // Return all entries
    },
    {
      detail: {
        description:
          "Returns all entries, including movies, TV shows, One Shots and extras",
      },
    }
  )
  .post(
    "/",
    async ({ bearer, query }) => {
      if (bearer !== process.env.API_BEARER) {
        return new Response("This endpoint is not public accessible", {
          status: 401,
        });
      }

      // Throws an error due to the Elysia validation but is converted by Drizzle anyway
      // @ts-ignore
      query.releaseDate = new Date(query.releaseDate);

      try {
        // Throws an error due to Elysia validation
        // @ts-ignore
        await db.insert(entries).values(query);
      } catch (error) {
        return new Response(
          "Could not create new entry: " + error?.toString(),
          { status: 400 }
        );
      }

      return new Response("Created new entry", { status: 201 });

      return query;
    },
    {
      query: t.Object({
        title: t.String({
          description: "test",
        }),
        releaseDate: t.String({
          description: "Use this format: YYYY-MM-DD",
        }),
        directors: t.Array(t.String()),
        medium: t.UnionEnum(["Movie", "Show", "Extra"]),
        runtime: t.Optional(t.Number()),
        posterUrl: t.String({
          format: "uri",
        }),
        characters: t.Array(t.Number()),
      }),
      detail: {
        description: "Create a new media entries. NOT PUBLICLY ACCESSIBLE",
      },
    }
  );
