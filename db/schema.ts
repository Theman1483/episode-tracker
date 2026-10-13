import { date, pgTable, serial, text } from "drizzle-orm/pg-core";

export const episodes = pgTable("episodes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  guest: text("guest"),
  youtube_url: text("youtube_url"),
  published_on: date("published_on"),
});
