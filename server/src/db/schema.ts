import { InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const entries = sqliteTable("entries", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  releaseDate: integer("release_date", { mode: "timestamp" }).notNull(),
  director: text("director").notNull(),
  medium: text("medium", { enum: ["Movie", "Show", "Extra"] }).notNull(),
  runtime: integer("runtime").notNull(),
  posterUrl: text("poster_url").notNull(),
  characters: text("characters", { mode: "json" }).default("[]"),
  episodes: text("episodes", { mode: "json" }).default("[]"),
});

export type Entry = InferSelectModel<typeof entries>;

export const episodes = sqliteTable("episodes", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  releaseDate: integer("release_date", { mode: "timestamp" }).notNull(),
  director: text("director").notNull(),
  runtime: integer("runtime").notNull(),
  series: text("series").notNull(),
  seasonNumber: integer("season_number").notNull(),
  episodeNumber: integer("episode_number").notNull(),
  characters: text("characters", { mode: "json" }).default("[]"),
});

export type Episode = InferSelectModel<typeof episodes>;

export const characters = sqliteTable("characters", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("title").notNull(),
  portraitUrl: text("portrait_url").notNull(),
  actors: text("actors", { mode: "json" }).default("[]"),
  appearances: text("appearances", { mode: "json" }).default("[]"),
});

export type Characters = InferSelectModel<typeof characters>;
