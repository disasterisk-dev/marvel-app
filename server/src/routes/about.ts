import { episodes } from "../db/episodeSchema";
import Elysia from "elysia";
import { db } from "..";
import { entries } from "../db/entrySchema";

export const aboutRoute = new Elysia({ prefix: "/about" }).get(
  "/",
  async () => {
    let movieCount = 0;
    let showCount = 0;
    let extraCount = 0;
    let episodeCount = 0;
    let totalRuntime = 0;

    const entryList = await db
      .select()
      .from(entries)
      .all()
      .then((res) => {
        res.forEach((e) => {
          if (e.medium === "Movie") movieCount++;
          if (e.medium === "Extra") extraCount++;
          if (e.medium === "Show") showCount++;

          if (e.runtime) totalRuntime += e.runtime;

          return;
        });
      });

    const episodeList = await db
      .select()
      .from(episodes)
      .all()
      .then((res) => {
        episodeCount = res.length;

        res.forEach((e) => {
          totalRuntime += e.runtime;
        });
      });

    return {
      movieCount,
      showCount,
      extraCount,
      episodeCount,
      totalRuntime,
    };
  }
);
