import { InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";

export const episodes = sqliteTable("episodes", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  releaseDate: integer("release_date", { mode: "timestamp" }).notNull(),
  directors: text("directors", { mode: "json" }).notNull().default("[]"),
  runtime: integer("runtime").notNull(),
  series: integer("series").notNull(),
  episodeNumber: integer("episode_number").notNull(),
});

// the raw Type to be used generally
export type Episode = InferSelectModel<typeof episodes>;
// a Typebox schema for validation with Elysia
export const episodeSchema = createSelectSchema(episodes, {
  id: t.Number({
    description: "The numerical identifier assigned to each episode.",
  }),
  title: t.String({
    description: "The name of the episode.",
  }),
  releaseDate: t.Date({
    description:
      "The day the episode originally premiered. Time defaults to midnight.",
  }),
  directors: t.Array(t.String(), {
    description:
      "The director(s) of the episode. Multiple directors are rare, but this always returns an array for consistency.",
  }),
  runtime: t.Number({
    description: "Length of the episode in minutes.",
  }),
  series: t.Number({
    description:
      "The number ID of entry representing the series, or season of a series, that the episode belongs to.",
  }),
  episodeNumber: t.Number({
    description: "The position of the episode in its season/series.",
  }),
});
