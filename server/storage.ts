import {
  users,
  songs,
  songStories,
  reactions,
  playlists,
  playlistSongs,
  tags,
  songTags,
  songOfTheDay,
  albums,
  languages,
  artists,
  songArtists,
  comments,
  userMentions,
  notifications,
  type User,
  type UpsertUser,
  type Song,
  type InsertSong,
  type SongStory,
  type InsertSongStory,
  type Reaction,
  type InsertReaction,
  type Playlist,
  type InsertPlaylist,
  type PlaylistSong,
  type InsertPlaylistSong,
  type Tag,
  type InsertTag,
  type SongTag,
  type InsertSongTag,
  type SongOfTheDay,
  type InsertSongOfTheDay,
  type Album,
  type InsertAlbum,
  type Language,
  type InsertLanguage,
  type Artist,
  type InsertArtist,
  type SongArtist,
  type InsertSongArtist,
  type Comment,
  type InsertComment,
  type UserMention,
  type InsertUserMention,
  type Notification,
  type InsertNotification,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, inArray, ilike } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<{ firstName: string | null; lastName: string | null; profileImageUrl: string | null }>): Promise<User>;

  // Song operations
  getSong(id: string): Promise<Song | undefined>;
  getSongByYoutubeId(youtubeId: string): Promise<Song | undefined>;
  createSong(song: InsertSong): Promise<Song>;
  updateSong(id: string, updates: Partial<InsertSong>): Promise<Song>;
  getAllSongs(): Promise<Song[]>;
  searchSongs(query: string): Promise<Song[]>;
  
  // Song story operations
  getSongStory(songId: string, userId: string): Promise<SongStory | undefined>;
  createSongStory(story: InsertSongStory): Promise<SongStory>;
  updateSongStory(id: string, story: string): Promise<SongStory>;
  getSongStoriesBySongId(songId: string): Promise<SongStory[]>;
  
  // Reaction operations
  getReaction(songId: string, userId: string, type: string): Promise<Reaction | undefined>;
  createReaction(reaction: InsertReaction): Promise<Reaction>;
  deleteReaction(id: string): Promise<void>;
  getReactionsBySongId(songId: string): Promise<Reaction[]>;
  getReactionsByUserId(userId: string): Promise<Reaction[]>;
  
  // Playlist operations
  getPlaylist(id: string): Promise<Playlist | undefined>;
  getPlaylistsByUserId(userId: string): Promise<Playlist[]>;
  createPlaylist(playlist: InsertPlaylist): Promise<Playlist>;
  updatePlaylist(id: string, title: string): Promise<Playlist>;
  deletePlaylist(id: string): Promise<void>;
  
  // Playlist song operations
  addSongToPlaylist(playlistSong: InsertPlaylistSong): Promise<PlaylistSong>;
  removeSongFromPlaylist(playlistId: string, songId: string): Promise<void>;
  getPlaylistSongs(playlistId: string): Promise<PlaylistSong[]>;
  
  // Tag operations
  getTag(id: string): Promise<Tag | undefined>;
  getTagByName(name: string): Promise<Tag | undefined>;
  createTag(tag: InsertTag): Promise<Tag>;
  getAllTags(): Promise<Tag[]>;
  
  // Song tag operations
  addTagToSong(songTag: InsertSongTag): Promise<SongTag>;
  removeTagFromSong(songId: string, tagId: string): Promise<void>;
  getSongTags(songId: string): Promise<SongTag[]>;
  
  // Song of the day operations
  getTodaysSongForUser(userId: string): Promise<SongOfTheDay | undefined>;
  createSongOfTheDay(sotd: InsertSongOfTheDay): Promise<SongOfTheDay>;
  
  // Album operations
  getAlbumByName(name: string): Promise<Album | undefined>;
  createAlbum(album: InsertAlbum): Promise<Album>;
  getAllAlbums(): Promise<Album[]>;
  searchAlbums(query: string): Promise<Album[]>;
  
  // Language operations
  getLanguageByName(name: string): Promise<Language | undefined>;
  createLanguage(language: InsertLanguage): Promise<Language>;
  getAllLanguages(): Promise<Language[]>;
  searchLanguages(query: string): Promise<Language[]>;
  
  // Artist operations
  getArtistByName(name: string): Promise<Artist | undefined>;
  createArtist(artist: InsertArtist): Promise<Artist>;
  getAllArtists(): Promise<Artist[]>;
  searchArtists(query: string): Promise<Artist[]>;
  
  // Song artist operations
  addArtistToSong(songArtist: InsertSongArtist): Promise<SongArtist>;
  getSongArtists(songId: string): Promise<Artist[]>;
  removeArtistFromSong(songId: string, artistId: string): Promise<void>;
  
  // Comment operations
  createComment(comment: InsertComment): Promise<Comment>;
  getCommentsBySongId(songId: string): Promise<Comment[]>;
  deleteComment(id: string): Promise<void>;
  
  // User mention operations
  createUserMention(mention: InsertUserMention): Promise<UserMention>;
  getMentionsByCommentId(commentId: string): Promise<UserMention[]>;
  searchUsers(query: string): Promise<User[]>;
  
  // Notification operations
  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotificationsByUserId(userId: string): Promise<Notification[]>;
  getUnreadNotificationCount(userId: string): Promise<number>;
  markNotificationAsRead(id: string): Promise<void>;
  markAllNotificationsAsRead(userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<{ firstName: string | null; lastName: string | null; profileImageUrl: string | null }>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
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
    const [song] = await db.insert(songs).values(songData).returning();
    return song;
  }

  async updateSong(id: string, updates: Partial<InsertSong>): Promise<Song> {
    const [song] = await db
      .update(songs)
      .set(updates)
      .where(eq(songs.id, id))
      .returning();
    return song;
  }

  async getAllSongs(): Promise<Song[]> {
    return await db.select().from(songs).orderBy(desc(songs.createdAt));
  }

  async searchSongs(query: string): Promise<Song[]> {
    const searchPattern = `%${query}%`;
    const results = await db
      .selectDistinct({ song: songs })
      .from(songs)
      .leftJoin(songTags, eq(songs.id, songTags.songId))
      .leftJoin(tags, eq(songTags.tagId, tags.id))
      .where(
        sql`(
          ${songs.title} ILIKE ${searchPattern} 
          OR ${songs.artist} ILIKE ${searchPattern} 
          OR ${songs.album} ILIKE ${searchPattern}
          OR ${tags.name} ILIKE ${searchPattern}
        )`
      )
      .orderBy(desc(songs.createdAt))
      .limit(20);
    
    return results.map(r => r.song);
  }

  // Song story operations
  async getSongStory(songId: string, userId: string): Promise<SongStory | undefined> {
    const [story] = await db
      .select()
      .from(songStories)
      .where(and(eq(songStories.songId, songId), eq(songStories.userId, userId)));
    return story;
  }

  async createSongStory(storyData: InsertSongStory): Promise<SongStory> {
    const [story] = await db.insert(songStories).values(storyData).returning();
    return story;
  }

  async updateSongStory(id: string, storyText: string): Promise<SongStory> {
    const [story] = await db
      .update(songStories)
      .set({ story: storyText })
      .where(eq(songStories.id, id))
      .returning();
    return story;
  }

  async getSongStoriesBySongId(songId: string): Promise<SongStory[]> {
    return await db.select().from(songStories).where(eq(songStories.songId, songId));
  }

  // Reaction operations
  async getReaction(songId: string, userId: string, type: string): Promise<Reaction | undefined> {
    const [reaction] = await db
      .select()
      .from(reactions)
      .where(
        and(
          eq(reactions.songId, songId),
          eq(reactions.userId, userId),
          eq(reactions.type, type)
        )
      );
    return reaction;
  }

  async createReaction(reactionData: InsertReaction): Promise<Reaction> {
    const [reaction] = await db.insert(reactions).values(reactionData).returning();
    return reaction;
  }

  async deleteReaction(id: string): Promise<void> {
    await db.delete(reactions).where(eq(reactions.id, id));
  }

  async getReactionsBySongId(songId: string): Promise<Reaction[]> {
    return await db.select().from(reactions).where(eq(reactions.songId, songId));
  }

  async getReactionsByUserId(userId: string): Promise<Reaction[]> {
    return await db
      .select()
      .from(reactions)
      .where(eq(reactions.userId, userId))
      .orderBy(desc(reactions.createdAt));
  }

  // Playlist operations
  async getPlaylist(id: string): Promise<Playlist | undefined> {
    const [playlist] = await db.select().from(playlists).where(eq(playlists.id, id));
    return playlist;
  }

  async getPlaylistsByUserId(userId: string): Promise<Playlist[]> {
    return await db
      .select()
      .from(playlists)
      .where(eq(playlists.userId, userId))
      .orderBy(desc(playlists.updatedAt));
  }

  async createPlaylist(playlistData: InsertPlaylist): Promise<Playlist> {
    const [playlist] = await db.insert(playlists).values(playlistData).returning();
    return playlist;
  }

  async updatePlaylist(id: string, title: string): Promise<Playlist> {
    const [playlist] = await db
      .update(playlists)
      .set({ title, updatedAt: new Date() })
      .where(eq(playlists.id, id))
      .returning();
    return playlist;
  }

  async deletePlaylist(id: string): Promise<void> {
    await db.delete(playlists).where(eq(playlists.id, id));
  }

  // Playlist song operations
  async addSongToPlaylist(playlistSongData: InsertPlaylistSong): Promise<PlaylistSong> {
    const [playlistSong] = await db.insert(playlistSongs).values(playlistSongData).returning();
    return playlistSong;
  }

  async removeSongFromPlaylist(playlistId: string, songId: string): Promise<void> {
    await db
      .delete(playlistSongs)
      .where(and(eq(playlistSongs.playlistId, playlistId), eq(playlistSongs.songId, songId)));
  }

  async getPlaylistSongs(playlistId: string): Promise<PlaylistSong[]> {
    return await db
      .select()
      .from(playlistSongs)
      .where(eq(playlistSongs.playlistId, playlistId))
      .orderBy(playlistSongs.order);
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
    const [tag] = await db.insert(tags).values(tagData).returning();
    return tag;
  }

  async getAllTags(): Promise<Tag[]> {
    return await db.select().from(tags).orderBy(tags.name);
  }

  // Song tag operations
  async addTagToSong(songTagData: InsertSongTag): Promise<SongTag> {
    const [songTag] = await db.insert(songTags).values(songTagData).returning();
    return songTag;
  }

  async removeTagFromSong(songId: string, tagId: string): Promise<void> {
    await db
      .delete(songTags)
      .where(and(eq(songTags.songId, songId), eq(songTags.tagId, tagId)));
  }

  async getSongTags(songId: string): Promise<SongTag[]> {
    return await db.select().from(songTags).where(eq(songTags.songId, songId));
  }

  // Song of the day operations
  async getTodaysSongForUser(userId: string): Promise<SongOfTheDay | undefined> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [sotd] = await db
      .select()
      .from(songOfTheDay)
      .where(
        and(
          eq(songOfTheDay.userId, userId),
          sql`DATE(${songOfTheDay.assignedDate}) = DATE(${today})`
        )
      );
    return sotd;
  }

  async createSongOfTheDay(sotdData: InsertSongOfTheDay): Promise<SongOfTheDay> {
    const [sotd] = await db.insert(songOfTheDay).values(sotdData).returning();
    return sotd;
  }

  // Album operations
  async getAlbumByName(name: string): Promise<Album | undefined> {
    const [album] = await db.select().from(albums).where(eq(albums.name, name));
    return album;
  }

  async createAlbum(albumData: InsertAlbum): Promise<Album> {
    const [album] = await db.insert(albums).values(albumData).returning();
    return album;
  }

  async getAllAlbums(): Promise<Album[]> {
    return await db.select().from(albums).orderBy(albums.name);
  }

  async searchAlbums(query: string): Promise<Album[]> {
    return await db
      .select()
      .from(albums)
      .where(ilike(albums.name, `%${query}%`))
      .orderBy(albums.name)
      .limit(10);
  }

  // Language operations
  async getLanguageByName(name: string): Promise<Language | undefined> {
    const [language] = await db.select().from(languages).where(eq(languages.name, name));
    return language;
  }

  async createLanguage(languageData: InsertLanguage): Promise<Language> {
    const [language] = await db.insert(languages).values(languageData).returning();
    return language;
  }

  async getAllLanguages(): Promise<Language[]> {
    return await db.select().from(languages).orderBy(languages.name);
  }

  async searchLanguages(query: string): Promise<Language[]> {
    return await db
      .select()
      .from(languages)
      .where(ilike(languages.name, `%${query}%`))
      .orderBy(languages.name)
      .limit(10);
  }

  // Artist operations
  async getArtistByName(name: string): Promise<Artist | undefined> {
    const [artist] = await db.select().from(artists).where(eq(artists.name, name));
    return artist;
  }

  async createArtist(artistData: InsertArtist): Promise<Artist> {
    const [artist] = await db.insert(artists).values(artistData).returning();
    return artist;
  }

  async getAllArtists(): Promise<Artist[]> {
    return await db.select().from(artists).orderBy(artists.name);
  }

  async searchArtists(query: string): Promise<Artist[]> {
    return await db
      .select()
      .from(artists)
      .where(ilike(artists.name, `%${query}%`))
      .orderBy(artists.name)
      .limit(10);
  }

  // Song artist operations
  async addArtistToSong(songArtistData: InsertSongArtist): Promise<SongArtist> {
    const [songArtist] = await db.insert(songArtists).values(songArtistData).returning();
    return songArtist;
  }

  async getSongArtists(songId: string): Promise<Artist[]> {
    const results = await db
      .select({ artist: artists })
      .from(songArtists)
      .innerJoin(artists, eq(songArtists.artistId, artists.id))
      .where(eq(songArtists.songId, songId));
    return results.map((r) => r.artist);
  }

  async removeArtistFromSong(songId: string, artistId: string): Promise<void> {
    await db
      .delete(songArtists)
      .where(and(eq(songArtists.songId, songId), eq(songArtists.artistId, artistId)));
  }

  // Comment operations
  async createComment(commentData: InsertComment): Promise<Comment> {
    const [comment] = await db.insert(comments).values(commentData).returning();
    return comment;
  }

  async getCommentsBySongId(songId: string): Promise<Comment[]> {
    return await db
      .select()
      .from(comments)
      .where(eq(comments.songId, songId))
      .orderBy(desc(comments.createdAt));
  }

  async deleteComment(id: string): Promise<void> {
    await db.delete(comments).where(eq(comments.id, id));
  }

  // User mention operations
  async createUserMention(mentionData: InsertUserMention): Promise<UserMention> {
    const [mention] = await db.insert(userMentions).values(mentionData).returning();
    return mention;
  }

  async getMentionsByCommentId(commentId: string): Promise<UserMention[]> {
    return await db
      .select()
      .from(userMentions)
      .where(eq(userMentions.commentId, commentId));
  }

  async searchUsers(query: string): Promise<User[]> {
    const searchPattern = `%${query}%`;
    return await db
      .select()
      .from(users)
      .where(
        sql`(
          ${users.firstName} ILIKE ${searchPattern} 
          OR ${users.lastName} ILIKE ${searchPattern}
          OR ${users.email} ILIKE ${searchPattern}
          OR (${users.firstName} || ' ' || ${users.lastName}) ILIKE ${searchPattern}
          OR (${users.firstName} || ${users.lastName}) ILIKE ${searchPattern}
        )`
      )
      .limit(10);
  }

  // Notification operations
  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const [notification] = await db.insert(notifications).values(notificationData).returning();
    return notification;
  }

  async getNotificationsByUserId(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(50);
  }

  async getUnreadNotificationCount(userId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
    return Number(result[0]?.count || 0);
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id));
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.userId, userId));
  }
}

export const storage = new DatabaseStorage();
