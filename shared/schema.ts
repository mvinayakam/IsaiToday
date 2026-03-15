import {
  index,
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  unique,
} from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User storage table
export const users = mysqlTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  email: varchar("email", { length: 255 }).unique(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  profileImageUrl: varchar("profile_image_url", { length: 512 }),
  passwordHash: varchar("password_hash", { length: 255 }),
  role: varchar("role", { length: 50 }).default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Albums table
export const albums = mysqlTable("albums", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAlbumSchema = createInsertSchema(albums).omit({ id: true, createdAt: true });
export type InsertAlbum = z.infer<typeof insertAlbumSchema>;
export type Album = typeof albums.$inferSelect;

// Languages table
export const languages = mysqlTable("languages", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLanguageSchema = createInsertSchema(languages).omit({ id: true, createdAt: true });
export type InsertLanguage = z.infer<typeof insertLanguageSchema>;
export type Language = typeof languages.$inferSelect;

// Artists table
export const artists = mysqlTable("artists", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertArtistSchema = createInsertSchema(artists).omit({ id: true, createdAt: true });
export type InsertArtist = z.infer<typeof insertArtistSchema>;
export type Artist = typeof artists.$inferSelect;

// Songs table
export const songs = mysqlTable("songs", {
  id: varchar("id", { length: 255 }).primaryKey(),
  youtubeId: varchar("youtube_id", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 512 }).notNull(),
  artist: varchar("artist", { length: 255 }).notNull(),
  album: varchar("album", { length: 255 }),
  language: varchar("language", { length: 100 }),
  thumbnail: varchar("thumbnail", { length: 512 }),
  addedBy: varchar("added_by", { length: 255 }).references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSongSchema = createInsertSchema(songs).omit({ id: true, createdAt: true });
export type InsertSong = z.infer<typeof insertSongSchema>;
export type Song = typeof songs.$inferSelect;

// Song artists (many-to-many)
export const songArtists = mysqlTable("song_artists", {
  id: varchar("id", { length: 255 }).primaryKey(),
  songId: varchar("song_id", { length: 255 }).references(() => songs.id, { onDelete: "cascade" }).notNull(),
  artistId: varchar("artist_id", { length: 255 }).references(() => artists.id, { onDelete: "cascade" }).notNull(),
}, (table) => [unique().on(table.songId, table.artistId)]);

export const insertSongArtistSchema = createInsertSchema(songArtists).omit({ id: true });
export type InsertSongArtist = z.infer<typeof insertSongArtistSchema>;
export type SongArtist = typeof songArtists.$inferSelect;

// Song stories table
export const songStories = mysqlTable("song_stories", {
  id: varchar("id", { length: 255 }).primaryKey(),
  songId: varchar("song_id", { length: 255 }).references(() => songs.id).notNull(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  story: text("story").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [unique().on(table.songId, table.userId)]);

export const insertSongStorySchema = createInsertSchema(songStories).omit({ id: true, createdAt: true });
export type InsertSongStory = z.infer<typeof insertSongStorySchema>;
export type SongStory = typeof songStories.$inferSelect;

// Reactions table
export const reactions = mysqlTable("reactions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  songId: varchar("song_id", { length: 255 }).references(() => songs.id).notNull(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  type: varchar("type", { length: 50 }).default("like").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [unique().on(table.songId, table.userId, table.type)]);

export const insertReactionSchema = createInsertSchema(reactions).omit({ id: true, createdAt: true });
export type InsertReaction = z.infer<typeof insertReactionSchema>;
export type Reaction = typeof reactions.$inferSelect;

// Playlists table
export const playlists = mysqlTable("playlists", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPlaylistSchema = createInsertSchema(playlists).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertPlaylist = z.infer<typeof insertPlaylistSchema>;
export type Playlist = typeof playlists.$inferSelect;

// Playlist songs table
export const playlistSongs = mysqlTable("playlist_songs", {
  id: varchar("id", { length: 255 }).primaryKey(),
  playlistId: varchar("playlist_id", { length: 255 }).references(() => playlists.id, { onDelete: "cascade" }).notNull(),
  songId: varchar("song_id", { length: 255 }).references(() => songs.id).notNull(),
  order: int("order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [unique().on(table.playlistId, table.songId)]);

export const insertPlaylistSongSchema = createInsertSchema(playlistSongs).omit({ id: true, createdAt: true });
export type InsertPlaylistSong = z.infer<typeof insertPlaylistSongSchema>;
export type PlaylistSong = typeof playlistSongs.$inferSelect;

// Tags table
export const tags = mysqlTable("tags", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTagSchema = createInsertSchema(tags).omit({ id: true, createdAt: true });
export type InsertTag = z.infer<typeof insertTagSchema>;
export type Tag = typeof tags.$inferSelect;

// Song tags (many-to-many)
export const songTags = mysqlTable("song_tags", {
  id: varchar("id", { length: 255 }).primaryKey(),
  songId: varchar("song_id", { length: 255 }).references(() => songs.id, { onDelete: "cascade" }).notNull(),
  tagId: varchar("tag_id", { length: 255 }).references(() => tags.id, { onDelete: "cascade" }).notNull(),
}, (table) => [unique().on(table.songId, table.tagId)]);

export const insertSongTagSchema = createInsertSchema(songTags).omit({ id: true });
export type InsertSongTag = z.infer<typeof insertSongTagSchema>;
export type SongTag = typeof songTags.$inferSelect;

// Song of the day
export const songOfTheDay = mysqlTable("song_of_the_day", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  songId: varchar("song_id", { length: 255 }).references(() => songs.id).notNull(),
  assignedDate: timestamp("assigned_date").defaultNow().notNull(),
}, (table) => [index("idx_sotd_user_date").on(table.userId, table.assignedDate)]);

export const insertSongOfTheDaySchema = createInsertSchema(songOfTheDay).omit({ id: true });
export type InsertSongOfTheDay = z.infer<typeof insertSongOfTheDaySchema>;
export type SongOfTheDay = typeof songOfTheDay.$inferSelect;

// Comments table
export const comments = mysqlTable("comments", {
  id: varchar("id", { length: 255 }).primaryKey(),
  songId: varchar("song_id", { length: 255 }).references(() => songs.id, { onDelete: "cascade" }).notNull(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_comments_song").on(table.songId),
  index("idx_comments_user").on(table.userId),
]);

export const insertCommentSchema = createInsertSchema(comments).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

// User mentions table
export const userMentions = mysqlTable("user_mentions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  commentId: varchar("comment_id", { length: 255 }).references(() => comments.id, { onDelete: "cascade" }),
  storyId: varchar("story_id", { length: 255 }).references(() => songStories.id, { onDelete: "cascade" }),
  mentionedUserId: varchar("mentioned_user_id", { length: 255 }).references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserMentionSchema = createInsertSchema(userMentions).omit({ id: true, createdAt: true });
export type InsertUserMention = z.infer<typeof insertUserMentionSchema>;
export type UserMention = typeof userMentions.$inferSelect;

// Notifications table
export const notifications = mysqlTable("notifications", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id, { onDelete: "cascade" }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  commentId: varchar("comment_id", { length: 255 }).references(() => comments.id, { onDelete: "cascade" }),
  songId: varchar("song_id", { length: 255 }).references(() => songs.id, { onDelete: "cascade" }),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_notifications_user").on(table.userId),
  index("idx_notifications_read").on(table.userId, table.isRead),
]);

export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
