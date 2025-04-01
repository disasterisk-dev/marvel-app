import { InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";

export const entries = sqliteTable("entries", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  releaseDate: integer("release_date", { mode: "timestamp" }).notNull(),
  directors: text("directors", { mode: "json" }).notNull().default("[]"),
  medium: text("medium", { enum: ["Movie", "Show", "Extra"] }).notNull(),
  runtime: integer("runtime"),
  posterUrl: text("poster_url").notNull(),
  characters: text("characters", { mode: "json" }).default("[]"),
  phase: integer("phase"),
});

// the raw Type to be used generally
export type Entry = InferSelectModel<typeof entries>;

// a Typebox schema for validation with Elysia
export const entrySelectSchema = createSelectSchema(entries, {
  id: t.Number({
    description: "The numerical identifier for this entry. (Auto generated).",
  }),
  title: t.String({
    description:
      "The title of the movie, series/season, one-shot, or web series.",
  }),
  releaseDate: t.Date({
    description:
      "The earliest premiere date for this project. For shows this is the premiere date of episode one. Standard ISO format.",
  }),
  directors: t.Array(t.String(), {
    description: "An array of directors involved in the project.",
  }),
  medium: t.UnionEnum(["Movie", "Show", "Extra"], {
    description: "The format of this project.",
  }),
  runtime: t.Nullable(t.Number(), {
    description:
      "Length of the entry. For series this is calculated at runtime based on episode runtimes.",
  }),
  posterUrl: t.String({
    description:
      "A live link to the poster for this project. Hosted on the same server as this API for reliability, all rights belong to Marvel.",
  }),
  characters: t.Array(
    t.Number({
      description:
        "An array of IDs belonging to the characters listed in this API.",
    })
  ),
  phase: t.Number({
    description:
      "The phase of the MCU this was project released in. Unless a movie is declaratively the end of a phase (ie The Avengers ending phase 1) shows released after the last movie of a phase remain in the previous phase.",
  }),
});

// a Typebox schema for creating new entries CURRENTLY OUT OF USE
export const entryCreateSchema = createInsertSchema(entries, {
  title: t.String({
    description:
      "The title of the movie, series/season, one-shot, or web series.",
  }),
  releaseDate: t.String({
    description:
      "The earliest premiere date for this project. Use YYYY-MM-DD format, time is not used.",
  }),
  medium: t.UnionEnum(["Movie", "Show", "Extra"], {
    description: "The format of this project.",
  }),
  runtime: t.Nullable(t.Number(), {
    description:
      "Length of the entry. For series this is calculated at runtime based on episode runtimes.",
  }),
  posterUrl: t.String({
    description:
      "The file name for the poster image. URL formatting provided at runtime.",
  }),
  characters: t.Array(
    t.Number({
      description:
        "A comma separated list of number IDs of characters who appear.",
    })
  ),
  phase: t.Number({
    description:
      "The phase of the MCU this was project released in. Unless a movie is declaratively the end of a phase (ie The Avengers ending phase 1) shows released after the last movie of a phase remain in the previous phase.",
  }),
});
