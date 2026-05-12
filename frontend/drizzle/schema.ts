import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  boolean,
  json,
} from "drizzle-orm/pg-core";

export const videos = pgTable("videos", {

  id: serial("id").primaryKey(),

  title: text("title").notNull(),

  description: text("description"),

  videoUrls: json("video_urls").notNull(),

  thumbnailUrl: text("thumbnail_url"),

  views: integer("views").default(0),

  duration: text("duration"),

  category: text("category").notNull(),

  isPublished: boolean("is_published").default(true),

  // createdAt: timestamp("created_at").defaultNow(),
  // drizzle/schema.ts
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),

});