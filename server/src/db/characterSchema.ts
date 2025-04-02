import { desc, InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";

export const characters = sqliteTable("characters", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  actors: text("actors", { mode: "json" }).default("[]"),
});

export type Characters = InferSelectModel<typeof characters>;

export const characterSchema = createSelectSchema(characters, {
  id: t.Number(),
  name: t.String(),
  actors: t.Array(t.String()),
});
