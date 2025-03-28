import { InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const entries = sqliteTable("entries", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  releaseDate: integer("release_date", { mode: "timestamp" }).notNull(),
  directors: text("directors", { mode: "json" }).notNull().default("[]"),
  writers: text("writers", { mode: "json" }).notNull().default("[]"),
  medium: text("medium", { enum: ["Movie", "Show", "Extra"] }).notNull(),
  runtime: integer("runtime"),
  posterUrl: text("poster_url").notNull(),
  characters: text("characters", { mode: "json" }).default("[]"),
  phase: integer("phase"),
});

export type Entry = InferSelectModel<typeof entries>;

export const episodes = sqliteTable("episodes", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  releaseDate: integer("release_date", { mode: "timestamp" }).notNull(),
  directors: text("directors", { mode: "json" }).notNull().default("[]"),
  writers: text("writers", { mode: "json" }).notNull().default("[]"),
  runtime: integer("runtime").notNull(),
  series: integer("series").notNull(),
  episodeNumber: integer("episode_number").notNull(),
});

export type Episode = InferSelectModel<typeof episodes>;

export const characters = sqliteTable("characters", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  actors: text("actors", { mode: "json" }).default("[]"),
});

export type Characters = InferSelectModel<typeof characters>;
