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
  id: t.Number({
    description: "The numerical ID for the character (Auto generated).",
  }),
  name: t.String({
    description:
      "The name of the character. Any character with an alias uses that alias (ie Iron Man instead of Tony Stark). When more than one character uses an alias (ie Steve Rogers and Sam Wilson are both Captain America) their civilian name is included in parentheses.",
  }),
  actors: t.Array(t.String(), {
    description:
      "List of actors who have played this character. Reserved for primary versions of the character, younger versions are not included.",
  }),
});
