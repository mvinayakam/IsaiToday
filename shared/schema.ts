import { sql } from 'drizzle-orm';
import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
  boolean,
  unique,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - Required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - Required for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Albums table
export const albums = pgTable("albums", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAlbumSchema = createInsertSchema(albums).omit({
  id: true,
  createdAt: true,
});
export type InsertAlbum = z.infer<typeof insertAlbumSchema>;
export type Album = typeof albums.$inferSelect;

// Languages table
export const languages = pgTable("languages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLanguageSchema = createInsertSchema(languages).omit({
  id: true,
  createdAt: true,
});
export type InsertLanguage = z.infer<typeof insertLanguageSchema>;
export type Language = typeof languages.$inferSelect;

// Artists table
export const artists = pgTable("artists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertArtistSchema = createInsertSchema(artists).omit({
  id: true,
  createdAt: true,
});
export type InsertArtist = z.infer<typeof insertArtistSchema>;
export type Artist = typeof artists.$inferSelect;

// Songs table
export const songs = pgTable("songs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  youtubeId: varchar("youtube_id").notNull().unique(),
  title: varchar("title").notNull(),
  artist: varchar("artist").notNull(), // Kept for backward compatibility
  album: varchar("album"), // Album name - no validation, user can type anything
  language: varchar("language"), // Language name - no validation, user can type anything
  thumbnail: varchar("thumbnail"),
  addedBy: varchar("added_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSongSchema = createInsertSchema(songs).omit({
  id: true,
  createdAt: true,
});
export type InsertSong = z.infer<typeof insertSongSchema>;
export type Song = typeof songs.$inferSelect;

// Song artists table (many-to-many relationship)
export const songArtists = pgTable("song_artists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  songId: varchar("song_id").references(() => songs.id, { onDelete: "cascade" }).notNull(),
  artistId: varchar("artist_id").references(() => artists.id, { onDelete: "cascade" }).notNull(),
}, (table) => [
  unique().on(table.songId, table.artistId),
]);

export const insertSongArtistSchema = createInsertSchema(songArtists).omit({
  id: true,
});
export type InsertSongArtist = z.infer<typeof insertSongArtistSchema>;
export type SongArtist = typeof songArtists.$inferSelect;

// Song stories table
export const songStories = pgTable("song_stories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  songId: varchar("song_id").references(() => songs.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  story: text("story").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  unique().on(table.songId, table.userId), // Each user can only have one story per song
]);

export const insertSongStorySchema = createInsertSchema(songStories).omit({
  id: true,
  createdAt: true,
});
export type InsertSongStory = z.infer<typeof insertSongStorySchema>;
export type SongStory = typeof songStories.$inferSelect;

// Reactions table
export const reactions = pgTable("reactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  songId: varchar("song_id").references(() => songs.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: varchar("type").default("like").notNull(), // For future: love, fire, etc
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  unique().on(table.songId, table.userId, table.type),
]);

export const insertReactionSchema = createInsertSchema(reactions).omit({
  id: true,
  createdAt: true,
});
export type InsertReaction = z.infer<typeof insertReactionSchema>;
export type Reaction = typeof reactions.$inferSelect;

// Playlists table
export const playlists = pgTable("playlists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: varchar("title").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPlaylistSchema = createInsertSchema(playlists).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertPlaylist = z.infer<typeof insertPlaylistSchema>;
export type Playlist = typeof playlists.$inferSelect;

// Playlist songs table
export const playlistSongs = pgTable("playlist_songs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playlistId: varchar("playlist_id").references(() => playlists.id, { onDelete: "cascade" }).notNull(),
  songId: varchar("song_id").references(() => songs.id).notNull(),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  unique().on(table.playlistId, table.songId),
]);

export const insertPlaylistSongSchema = createInsertSchema(playlistSongs).omit({
  id: true,
  createdAt: true,
});
export type InsertPlaylistSong = z.infer<typeof insertPlaylistSongSchema>;
export type PlaylistSong = typeof playlistSongs.$inferSelect;

// Tags table
export const tags = pgTable("tags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTagSchema = createInsertSchema(tags).omit({
  id: true,
  createdAt: true,
});
export type InsertTag = z.infer<typeof insertTagSchema>;
export type Tag = typeof tags.$inferSelect;

// Song tags table
export const songTags = pgTable("song_tags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  songId: varchar("song_id").references(() => songs.id, { onDelete: "cascade" }).notNull(),
  tagId: varchar("tag_id").references(() => tags.id, { onDelete: "cascade" }).notNull(),
}, (table) => [
  unique().on(table.songId, table.tagId),
]);

export const insertSongTagSchema = createInsertSchema(songTags).omit({
  id: true,
});
export type InsertSongTag = z.infer<typeof insertSongTagSchema>;
export type SongTag = typeof songTags.$inferSelect;

// Song of the day assignments
export const songOfTheDay = pgTable("song_of_the_day", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  songId: varchar("song_id").references(() => songs.id).notNull(),
  assignedDate: timestamp("assigned_date").defaultNow().notNull(),
}, (table) => [
  index("idx_sotd_user_date").on(table.userId, table.assignedDate),
]);

export const insertSongOfTheDaySchema = createInsertSchema(songOfTheDay).omit({
  id: true,
});
export type InsertSongOfTheDay = z.infer<typeof insertSongOfTheDaySchema>;
export type SongOfTheDay = typeof songOfTheDay.$inferSelect;

// Comments table
export const comments = pgTable("comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  songId: varchar("song_id").references(() => songs.id, { onDelete: "cascade" }).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_comments_song").on(table.songId),
  index("idx_comments_user").on(table.userId),
]);

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

// User mentions table (for tracking @mentions in comments and stories)
export const userMentions = pgTable("user_mentions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  commentId: varchar("comment_id").references(() => comments.id, { onDelete: "cascade" }),
  storyId: varchar("story_id").references(() => songStories.id, { onDelete: "cascade" }),
  mentionedUserId: varchar("mentioned_user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserMentionSchema = createInsertSchema(userMentions).omit({
  id: true,
  createdAt: true,
});
export type InsertUserMention = z.infer<typeof insertUserMentionSchema>;
export type UserMention = typeof userMentions.$inferSelect;

// Notifications table
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  type: varchar("type").notNull(), // "mention", "reaction", etc.
  commentId: varchar("comment_id").references(() => comments.id, { onDelete: "cascade" }),
  songId: varchar("song_id").references(() => songs.id, { onDelete: "cascade" }),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_notifications_user").on(table.userId),
  index("idx_notifications_read").on(table.userId, table.isRead),
]);

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
