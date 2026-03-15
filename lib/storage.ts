import {
  users, songs, songStories, reactions, playlists, playlistSongs,
  tags, songTags, songOfTheDay, albums, languages, artists, songArtists,
  comments, userMentions, notifications,
  type User, type UpsertUser,
  type Song, type InsertSong,
  type SongStory, type InsertSongStory,
  type Reaction, type InsertReaction,
  type Playlist, type InsertPlaylist,
  type PlaylistSong, type InsertPlaylistSong,
  type Tag, type InsertTag,
  type SongTag, type InsertSongTag,
  type SongOfTheDay, type InsertSongOfTheDay,
  type Album, type InsertAlbum,
  type Language, type InsertLanguage,
  type Artist, type InsertArtist,
  type SongArtist, type InsertSongArtist,
  type Comment, type InsertComment,
  type UserMention, type InsertUserMention,
  type Notification, type InsertNotification,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, like } from "drizzle-orm";
import { randomUUID } from "crypto";

export class DatabaseStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const id = userData.id ?? randomUUID();
    await db.insert(users)
      .values({ ...userData, id })
      .onDuplicateKeyUpdate({
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: new Date(),
        },
      });
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user!;
  }

  async createUser(userData: Omit<UpsertUser, "id"> & { id?: string }): Promise<User> {
    const id = userData.id ?? randomUUID();
    await db.insert(users).values({ ...userData, id });
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user!;
  }

  async updateUser(id: string, updates: Partial<{ firstName: string | null; lastName: string | null; profileImageUrl: string | null }>): Promise<User> {
    await db.update(users).set({ ...updates, updatedAt: new Date() }).where(eq(users.id, id));
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) throw new Error("User not found");
    return user;
  }

  async searchUsers(query: string): Promise<User[]> {
    const p = `%${query}%`;
    return await db.select().from(users).where(
      sql`(${users.firstName} LIKE ${p} OR ${users.lastName} LIKE ${p} OR ${users.email} LIKE ${p} OR CONCAT(${users.firstName}, ' ', ${users.lastName}) LIKE ${p})`
    ).limit(10);
  }

  // Song operations
  async getSong(id: string): Promise<Song | undefined> {
    const [song] = await db.select().from(songs).where(eq(songs.id, id));
    return song;
  }

  async getSongByYoutubeId(youtubeId: string): Promise<Song | undefined> {
    const [song] = await db.select().from(songs).where(eq(songs.youtubeId, youtubeId));
    return song;
  }

  async createSong(songData: InsertSong): Promise<Song> {
    const id = randomUUID();
    await db.insert(songs).values({ ...songData, id });
    const [song] = await db.select().from(songs).where(eq(songs.id, id));
    return song!;
  }

  async updateSong(id: string, updates: Partial<InsertSong>): Promise<Song> {
    await db.update(songs).set(updates).where(eq(songs.id, id));
    const [song] = await db.select().from(songs).where(eq(songs.id, id));
    return song!;
  }

  async getAllSongs(): Promise<Song[]> {
    return await db.select().from(songs).orderBy(desc(songs.createdAt));
  }

  async searchSongs(query: string): Promise<Song[]> {
    const p = `%${query}%`;
    const results = await db
      .selectDistinct({ song: songs })
      .from(songs)
      .leftJoin(songTags, eq(songs.id, songTags.songId))
      .leftJoin(tags, eq(songTags.tagId, tags.id))
      .where(sql`(${songs.title} LIKE ${p} OR ${songs.artist} LIKE ${p} OR ${songs.album} LIKE ${p} OR ${tags.name} LIKE ${p})`)
      .orderBy(desc(songs.createdAt))
      .limit(20);
    return results.map(r => r.song);
  }

  // Song story operations
  async getSongStory(songId: string, userId: string): Promise<SongStory | undefined> {
    const [story] = await db.select().from(songStories)
      .where(and(eq(songStories.songId, songId), eq(songStories.userId, userId)));
    return story;
  }

  async createSongStory(storyData: InsertSongStory): Promise<SongStory> {
    const id = randomUUID();
    await db.insert(songStories).values({ ...storyData, id });
    const [story] = await db.select().from(songStories).where(eq(songStories.id, id));
    return story!;
  }

  async updateSongStory(id: string, storyText: string): Promise<SongStory> {
    await db.update(songStories).set({ story: storyText }).where(eq(songStories.id, id));
    const [story] = await db.select().from(songStories).where(eq(songStories.id, id));
    return story!;
  }

  async getSongStoriesBySongId(songId: string): Promise<SongStory[]> {
    return await db.select().from(songStories).where(eq(songStories.songId, songId));
  }

  // Reaction operations
  async getReaction(songId: string, userId: string, type: string): Promise<Reaction | undefined> {
    const [reaction] = await db.select().from(reactions)
      .where(and(eq(reactions.songId, songId), eq(reactions.userId, userId), eq(reactions.type, type)));
    return reaction;
  }

  async createReaction(reactionData: InsertReaction): Promise<Reaction> {
    const id = randomUUID();
    await db.insert(reactions).values({ ...reactionData, id });
    const [reaction] = await db.select().from(reactions).where(eq(reactions.id, id));
    return reaction!;
  }

  async deleteReaction(id: string): Promise<void> {
    await db.delete(reactions).where(eq(reactions.id, id));
  }

  async getReactionsBySongId(songId: string): Promise<Reaction[]> {
    return await db.select().from(reactions).where(eq(reactions.songId, songId));
  }

  async getReactionsByUserId(userId: string): Promise<Reaction[]> {
    return await db.select().from(reactions).where(eq(reactions.userId, userId)).orderBy(desc(reactions.createdAt));
  }

  // Playlist operations
  async getPlaylist(id: string): Promise<Playlist | undefined> {
    const [playlist] = await db.select().from(playlists).where(eq(playlists.id, id));
    return playlist;
  }

  async getPlaylistsByUserId(userId: string): Promise<Playlist[]> {
    return await db.select().from(playlists).where(eq(playlists.userId, userId)).orderBy(desc(playlists.updatedAt));
  }

  async createPlaylist(playlistData: InsertPlaylist): Promise<Playlist> {
    const id = randomUUID();
    await db.insert(playlists).values({ ...playlistData, id });
    const [playlist] = await db.select().from(playlists).where(eq(playlists.id, id));
    return playlist!;
  }

  async updatePlaylist(id: string, title: string): Promise<Playlist> {
    await db.update(playlists).set({ title, updatedAt: new Date() }).where(eq(playlists.id, id));
    const [playlist] = await db.select().from(playlists).where(eq(playlists.id, id));
    return playlist!;
  }

  async deletePlaylist(id: string): Promise<void> {
    await db.delete(playlists).where(eq(playlists.id, id));
  }

  // Playlist song operations
  async addSongToPlaylist(data: InsertPlaylistSong): Promise<PlaylistSong> {
    const id = randomUUID();
    await db.insert(playlistSongs).values({ ...data, id });
    const [ps] = await db.select().from(playlistSongs).where(eq(playlistSongs.id, id));
    return ps!;
  }

  async removeSongFromPlaylist(playlistId: string, songId: string): Promise<void> {
    await db.delete(playlistSongs)
      .where(and(eq(playlistSongs.playlistId, playlistId), eq(playlistSongs.songId, songId)));
  }

  async getPlaylistSongs(playlistId: string): Promise<PlaylistSong[]> {
    return await db.select().from(playlistSongs)
      .where(eq(playlistSongs.playlistId, playlistId)).orderBy(playlistSongs.order);
  }

  // Tag operations
  async getTag(id: string): Promise<Tag | undefined> {
    const [tag] = await db.select().from(tags).where(eq(tags.id, id));
    return tag;
  }

  async getTagByName(name: string): Promise<Tag | undefined> {
    const [tag] = await db.select().from(tags).where(eq(tags.name, name));
    return tag;
  }

  async createTag(tagData: InsertTag): Promise<Tag> {
    const id = randomUUID();
    await db.insert(tags).values({ ...tagData, id });
    const [tag] = await db.select().from(tags).where(eq(tags.id, id));
    return tag!;
  }

  async getAllTags(): Promise<Tag[]> {
    return await db.select().from(tags).orderBy(tags.name);
  }

  // Song tag operations
  async addTagToSong(data: InsertSongTag): Promise<SongTag> {
    const id = randomUUID();
    await db.insert(songTags).values({ ...data, id });
    const [st] = await db.select().from(songTags).where(eq(songTags.id, id));
    return st!;
  }

  async removeTagFromSong(songId: string, tagId: string): Promise<void> {
    await db.delete(songTags).where(and(eq(songTags.songId, songId), eq(songTags.tagId, tagId)));
  }

  async getSongTags(songId: string): Promise<SongTag[]> {
    return await db.select().from(songTags).where(eq(songTags.songId, songId));
  }

  // Song of the day
  async getTodaysSongForUser(userId: string): Promise<SongOfTheDay | undefined> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [sotd] = await db.select().from(songOfTheDay)
      .where(and(
        eq(songOfTheDay.userId, userId),
        sql`DATE(${songOfTheDay.assignedDate}) = DATE(${today.toISOString().slice(0, 10)})`
      ));
    return sotd;
  }

  async createSongOfTheDay(data: InsertSongOfTheDay): Promise<SongOfTheDay> {
    const id = randomUUID();
    await db.insert(songOfTheDay).values({ ...data, id });
    const [sotd] = await db.select().from(songOfTheDay).where(eq(songOfTheDay.id, id));
    return sotd!;
  }

  // Album operations
  async getAlbumByName(name: string): Promise<Album | undefined> {
    const [album] = await db.select().from(albums).where(eq(albums.name, name));
    return album;
  }

  async createAlbum(albumData: InsertAlbum): Promise<Album> {
    const id = randomUUID();
    await db.insert(albums).values({ ...albumData, id });
    const [album] = await db.select().from(albums).where(eq(albums.id, id));
    return album!;
  }

  async getAllAlbums(): Promise<Album[]> {
    return await db.select().from(albums).orderBy(albums.name);
  }

  async searchAlbums(query: string): Promise<Album[]> {
    return await db.select().from(albums).where(like(albums.name, `%${query}%`)).orderBy(albums.name).limit(10);
  }

  // Language operations
  async getLanguageByName(name: string): Promise<Language | undefined> {
    const [lang] = await db.select().from(languages).where(eq(languages.name, name));
    return lang;
  }

  async createLanguage(data: InsertLanguage): Promise<Language> {
    const id = randomUUID();
    await db.insert(languages).values({ ...data, id });
    const [lang] = await db.select().from(languages).where(eq(languages.id, id));
    return lang!;
  }

  async getAllLanguages(): Promise<Language[]> {
    return await db.select().from(languages).orderBy(languages.name);
  }

  async searchLanguages(query: string): Promise<Language[]> {
    return await db.select().from(languages).where(like(languages.name, `%${query}%`)).orderBy(languages.name).limit(10);
  }

  // Artist operations
  async getArtistByName(name: string): Promise<Artist | undefined> {
    const [artist] = await db.select().from(artists).where(eq(artists.name, name));
    return artist;
  }

  async createArtist(data: InsertArtist): Promise<Artist> {
    const id = randomUUID();
    await db.insert(artists).values({ ...data, id });
    const [artist] = await db.select().from(artists).where(eq(artists.id, id));
    return artist!;
  }

  async getAllArtists(): Promise<Artist[]> {
    return await db.select().from(artists).orderBy(artists.name);
  }

  async searchArtists(query: string): Promise<Artist[]> {
    return await db.select().from(artists).where(like(artists.name, `%${query}%`)).orderBy(artists.name).limit(10);
  }

  // Song artist operations
  async addArtistToSong(data: InsertSongArtist): Promise<SongArtist> {
    const id = randomUUID();
    await db.insert(songArtists).values({ ...data, id });
    const [sa] = await db.select().from(songArtists).where(eq(songArtists.id, id));
    return sa!;
  }

  async getSongArtists(songId: string): Promise<Artist[]> {
    const results = await db.select({ artist: artists })
      .from(songArtists)
      .innerJoin(artists, eq(songArtists.artistId, artists.id))
      .where(eq(songArtists.songId, songId));
    return results.map(r => r.artist);
  }

  async removeArtistFromSong(songId: string, artistId: string): Promise<void> {
    await db.delete(songArtists)
      .where(and(eq(songArtists.songId, songId), eq(songArtists.artistId, artistId)));
  }

  // Comment operations
  async createComment(data: InsertComment): Promise<Comment> {
    const id = randomUUID();
    await db.insert(comments).values({ ...data, id });
    const [comment] = await db.select().from(comments).where(eq(comments.id, id));
    return comment!;
  }

  async getCommentsBySongId(songId: string): Promise<Comment[]> {
    return await db.select().from(comments).where(eq(comments.songId, songId)).orderBy(desc(comments.createdAt));
  }

  async deleteComment(id: string): Promise<void> {
    await db.delete(comments).where(eq(comments.id, id));
  }

  // User mention operations
  async createUserMention(data: InsertUserMention): Promise<UserMention> {
    const id = randomUUID();
    await db.insert(userMentions).values({ ...data, id });
    const [mention] = await db.select().from(userMentions).where(eq(userMentions.id, id));
    return mention!;
  }

  async getMentionsByCommentId(commentId: string): Promise<UserMention[]> {
    return await db.select().from(userMentions).where(eq(userMentions.commentId, commentId));
  }

  // Notification operations
  async createNotification(data: InsertNotification): Promise<Notification> {
    const id = randomUUID();
    await db.insert(notifications).values({ ...data, id });
    const [notification] = await db.select().from(notifications).where(eq(notifications.id, id));
    return notification!;
  }

  async getNotificationsByUserId(userId: string): Promise<Notification[]> {
    return await db.select().from(notifications)
      .where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(50);
  }

  async getUnreadNotificationCount(userId: string): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
    return Number(result[0]?.count || 0);
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.userId, userId));
  }
}

export const storage = new DatabaseStorage();
