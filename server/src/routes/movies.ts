import bearer from "@elysiajs/bearer";
import { Elysia, t } from "elysia";
import { entries } from "../db/schema";
import { eq } from "drizzle-orm";
import { db } from "..";

export const moviesRoute = new Elysia({ prefix: "/movies" })
  .get(
    "/",
    async () => {
      const data = await db
        .select()
        .from(entries)
        .where(eq(entries.medium, "Movie"));

      data.forEach((m) => {
        m.posterUrl = process.env.BASE_URL + "/public/" + m.posterUrl;
      });

      return data;
    },
    {
      detail: {
        description: "Retrieve all movies.",
      },
    }
  )
  .get(
    "/:id",
    async ({ params }) => {
      const data = await db
        .select()
        .from(entries)
        .where(eq(entries.id, params.id));

      data[0].posterUrl = process.env.BASE_URL + "/public" + data[0].posterUrl;

      return data[0];
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
      detail: {
        description:
          "Use this to pull a single movie based on ID. IDs are plain numbers.",
      },
    }
  );
