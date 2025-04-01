import Elysia, { t } from "elysia";
import { db } from "..";
import { entries, episodes } from "../db/schema";
import { and, eq } from "drizzle-orm";

export const showsRoute = new Elysia({ prefix: "/shows" })
  .get("/", () => {
    // return all shows
  })
  .get(
    "/:id",
    async ({ params, error }) => {
      let showData;
      let epData;

      // Fetch series/season data
      try {
        showData = await db
          .select()
          .from(entries)
          .where(and(eq(entries.medium, "Show"), eq(entries.id, params.id)));
      } catch (e) {
        return error(404, {
          status: 404,
          error: e?.toString(),
        });
      }

      // fetch episodes for this series
      try {
        epData = await db
          .select()
          .from(episodes)
          .where(eq(episodes.series, params.id));
      } catch (e) {
        return error(404, {
          status: 404,
          error: e?.toString(),
        });
      }

      // calculate runtime from series/season episodes
      epData.forEach((e) => {
        showData[0].runtime! += e.runtime;
      });

      // append the file route to the poster url
      showData[0].posterUrl =
        process.env.BASE_URL + "/public" + showData[0].posterUrl;

      return {
        status: 200,
        retrievedAt: new Date(),
        data: {
          ...showData[0],
          episodes: epData,
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
            title: t.String({
              default: "Agents of S.H.I.E.L.D",
            }),
            releaseDate: t.Date({
              default: new Date(),
            }),
            directors: t.Array(
              t.String({
                default: "Jed Whedon",
              })
            ),
            medium: t.UnionEnum(["Movie", "Show", "Extra"], {
              default: "Show",
            }),
            runtime: t.Number({
              default: 60,
            }),
            posterUrl: t.String({
              format: "uri",
              default: process.env.BASE_URL + "/public/Shield1.jpg",
            }),
            characters: t.Array(t.Number({})),
            phase: t.Number(),
            episodes: t.Array(
              t.Object({
                id: t.Number(),
                title: t.String({
                  default: "Pilot",
                }),
                releaseDate: t.Date({
                  default: new Date(),
                }),
                directors: t.Array(
                  t.String({
                    default: "Joss Whedon",
                  })
                ),
                runtime: t.Number({
                  default: 45,
                }),
                series: t.Number(),
                episodeNumber: t.Number(),
              })
            ),
          }),
        }),
        404: t.Object({
          status: t.Number({
            default: 404,
          }),
          error: t.Optional(
            t.String({
              default: "Could not find show with that ID",
            })
          ),
        }),
      },
    }
  );
