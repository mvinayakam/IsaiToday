import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertSongSchema, insertSongStorySchema, insertReactionSchema, insertPlaylistSchema, insertPlaylistSongSchema, insertTagSchema, insertAlbumSchema, insertLanguageSchema, insertArtistSchema, songs, songStories, reactions, users, tags, songTags, type InsertSong } from "@shared/schema";
import { seedDatabase } from "./seed";
import { db } from "./db";
import { eq, desc, sql, and } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Get user by ID (for displaying story authors)
  app.get('/api/users/:userId', async (req, res) => {
    try {
      const user = await storage.getUser(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Song routes
  app.get('/api/songs', async (req, res) => {
    try {
      const allSongs = await storage.getAllSongs();
      res.json(allSongs);
    } catch (error) {
      console.error("Error fetching songs:", error);
      res.status(500).json({ message: "Failed to fetch songs" });
    }
  });

  app.get('/api/songs/:id', async (req, res) => {
    try {
      const song = await storage.getSong(req.params.id);
      if (!song) {
        return res.status(404).json({ message: "Song not found" });
      }
      res.json(song);
    } catch (error) {
      console.error("Error fetching song:", error);
      res.status(500).json({ message: "Failed to fetch song" });
    }
  });

  app.post('/api/songs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      console.log('[POST /api/songs] Request from user:', userId, 'body:', req.body);
      
      // Create album if provided and doesn't exist
      if (req.body.album && typeof req.body.album === 'string' && req.body.album.trim()) {
        const albumName = req.body.album.trim();
        const existingAlbum = await storage.getAlbumByName(albumName);
        if (!existingAlbum) {
          await storage.createAlbum({ name: albumName });
        }
      }
      
      // Create language if provided and doesn't exist
      if (req.body.language && typeof req.body.language === 'string' && req.body.language.trim()) {
        const languageName = req.body.language.trim();
        const existingLanguage = await storage.getLanguageByName(languageName);
        if (!existingLanguage) {
          await storage.createLanguage({ name: languageName });
        }
      }
      
      const validatedData = insertSongSchema.parse({
        ...req.body,
        addedBy: userId,
      });
      console.log('[POST /api/songs] Validated data:', validatedData);
      
      // Check if song already exists
      const existing = await storage.getSongByYoutubeId(validatedData.youtubeId);
      if (existing) {
        console.log('[POST /api/songs] Song already exists, returning:', existing.id);
        return res.json(existing);
      }
      
      const song = await storage.createSong(validatedData);
      console.log('[POST /api/songs] Song created successfully:', song.id, 'addedBy:', song.addedBy);
      
      // Verify it was actually saved
      const verified = await storage.getSong(song.id);
      console.log('[POST /api/songs] Verification query result:', verified ? 'Found' : 'NOT FOUND');
      
      res.status(201).json(song);
    } catch (error) {
      console.error("Error creating song:", error);
      res.status(500).json({ message: "Failed to create song" });
    }
  });

  app.put('/api/songs/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const song = await storage.getSong(req.params.id);
      
      if (!song) {
        return res.status(404).json({ message: "Song not found" });
      }
      
      // Only allow the user who added the song to edit it
      if (song.addedBy !== userId) {
        return res.status(403).json({ message: "You can only edit songs you added" });
      }
      
      // Create album if provided and doesn't exist
      if (req.body.album && typeof req.body.album === 'string' && req.body.album.trim()) {
        const albumName = req.body.album.trim();
        const existingAlbum = await storage.getAlbumByName(albumName);
        if (!existingAlbum) {
          await storage.createAlbum({ name: albumName });
        }
      }
      
      // Create language if provided and doesn't exist
      if (req.body.language && typeof req.body.language === 'string' && req.body.language.trim()) {
        const languageName = req.body.language.trim();
        const existingLanguage = await storage.getLanguageByName(languageName);
        if (!existingLanguage) {
          await storage.createLanguage({ name: languageName });
        }
      }
      
      const updates: Partial<InsertSong> = {};
      if (req.body.title) updates.title = req.body.title;
      if (req.body.artist) updates.artist = req.body.artist;
      if (req.body.album !== undefined) updates.album = req.body.album || null;
      if (req.body.language !== undefined) updates.language = req.body.language || null;
      if (req.body.thumbnail) updates.thumbnail = req.body.thumbnail;
      
      const updatedSong = await storage.updateSong(req.params.id, updates);
      res.json(updatedSong);
    } catch (error) {
      console.error("Error updating song:", error);
      res.status(500).json({ message: "Failed to update song" });
    }
  });

  // Song story routes
  app.get('/api/songs/:songId/stories', async (req, res) => {
    try {
      const stories = await storage.getSongStoriesBySongId(req.params.songId);
      res.json(stories);
    } catch (error) {
      console.error("Error fetching song stories:", error);
      res.status(500).json({ message: "Failed to fetch stories" });
    }
  });

  app.post('/api/songs/:songId/stories', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertSongStorySchema.parse({
        songId: req.params.songId,
        userId,
        story: req.body.story,
      });
      
      const story = await storage.createSongStory(validatedData);
      res.status(201).json(story);
    } catch (error) {
      console.error("Error creating song story:", error);
      res.status(500).json({ message: "Failed to create story" });
    }
  });

  app.put('/api/songs/:songId/stories/:storyId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Get the story to verify ownership
      const existingStory = await storage.getSongStory(req.params.songId, userId);
      if (!existingStory || existingStory.id !== req.params.storyId) {
        return res.status(404).json({ message: "Story not found or you don't have permission to edit it" });
      }
      
      const updatedStory = await storage.updateSongStory(req.params.storyId, req.body.story);
      res.json(updatedStory);
    } catch (error) {
      console.error("Error updating story:", error);
      res.status(500).json({ message: "Failed to update story" });
    }
  });

  // Reaction routes
  app.get('/api/songs/:songId/reactions', async (req, res) => {
    try {
      const reactions = await storage.getReactionsBySongId(req.params.songId);
      res.json(reactions);
    } catch (error) {
      console.error("Error fetching reactions:", error);
      res.status(500).json({ message: "Failed to fetch reactions" });
    }
  });

  app.post('/api/songs/:songId/reactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const type = req.body.type || 'like';
      
      // Check if reaction exists
      const existing = await storage.getReaction(req.params.songId, userId, type);
      if (existing) {
        // Remove reaction (toggle)
        await storage.deleteReaction(existing.id);
        return res.json({ action: 'removed' });
      }
      
      const validatedData = insertReactionSchema.parse({
        songId: req.params.songId,
        userId,
        type,
      });
      
      const reaction = await storage.createReaction(validatedData);
      res.status(201).json(reaction);
    } catch (error) {
      console.error("Error toggling reaction:", error);
      res.status(500).json({ message: "Failed to toggle reaction" });
    }
  });

  app.get('/api/users/:userId/reactions', async (req, res) => {
    try {
      // Get reactions with full song details, poster info, and reaction counts
      const reactionsWithSongs = await db
        .select({
          reaction: reactions,
          song: songs,
          poster: users,
          reactionCount: sql<number>`(
            SELECT COUNT(*) FROM ${reactions} r 
            WHERE r.song_id = ${songs.id}
          )::int`,
        })
        .from(reactions)
        .innerJoin(songs, eq(reactions.songId, songs.id))
        .leftJoin(users, eq(songs.addedBy, users.id))
        .where(eq(reactions.userId, req.params.userId))
        .orderBy(desc(reactions.createdAt))
        .limit(50);
      
      res.json(reactionsWithSongs);
    } catch (error) {
      console.error("Error fetching user reactions:", error);
      res.status(500).json({ message: "Failed to fetch reactions" });
    }
  });

  // Get user's posted songs with reaction counts
  app.get('/api/users/:userId/songs', async (req, res) => {
    try {
      const userSongs = await db
        .select({
          song: songs,
          reactionCount: sql<number>`(
            SELECT COUNT(*) FROM ${reactions} r 
            WHERE r.song_id = ${songs.id}
          )::int`,
        })
        .from(songs)
        .where(eq(songs.addedBy, req.params.userId))
        .orderBy(desc(songs.createdAt))
        .limit(50);
      
      res.json(userSongs);
    } catch (error) {
      console.error("Error fetching user songs:", error);
      res.status(500).json({ message: "Failed to fetch user songs" });
    }
  });

  // Playlist routes
  app.get('/api/playlists', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const playlists = await storage.getPlaylistsByUserId(userId);
      res.json(playlists);
    } catch (error) {
      console.error("Error fetching playlists:", error);
      res.status(500).json({ message: "Failed to fetch playlists" });
    }
  });

  app.post('/api/playlists', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Check if there are at least 50 songs in the database
      const allSongs = await storage.getAllSongs();
      if (allSongs.length < 50) {
        return res.status(403).json({ 
          message: "Playlist creation requires at least 50 songs in the database",
          songCount: allSongs.length,
          required: 50
        });
      }
      
      const validatedData = insertPlaylistSchema.parse({
        userId,
        title: req.body.title,
      });
      
      const playlist = await storage.createPlaylist(validatedData);
      res.status(201).json(playlist);
    } catch (error) {
      console.error("Error creating playlist:", error);
      res.status(500).json({ message: "Failed to create playlist" });
    }
  });

  app.get('/api/playlists/:id/songs', async (req, res) => {
    try {
      const playlistSongs = await storage.getPlaylistSongs(req.params.id);
      res.json(playlistSongs);
    } catch (error) {
      console.error("Error fetching playlist songs:", error);
      res.status(500).json({ message: "Failed to fetch playlist songs" });
    }
  });

  app.post('/api/playlists/:id/songs', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertPlaylistSongSchema.parse({
        playlistId: req.params.id,
        songId: req.body.songId,
        order: req.body.order,
      });
      
      const playlistSong = await storage.addSongToPlaylist(validatedData);
      res.status(201).json(playlistSong);
    } catch (error) {
      console.error("Error adding song to playlist:", error);
      res.status(500).json({ message: "Failed to add song to playlist" });
    }
  });

  // Tag routes
  app.get('/api/tags', async (req, res) => {
    try {
      const tags = await storage.getAllTags();
      res.json(tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
      res.status(500).json({ message: "Failed to fetch tags" });
    }
  });

  // Get tags with usage counts for tag cloud
  app.get('/api/tags/cloud', async (req, res) => {
    try {
      const tagCloud = await db
        .select({
          id: tags.id,
          name: tags.name,
          count: sql<number>`count(${songTags.songId})::int`,
        })
        .from(tags)
        .leftJoin(songTags, eq(tags.id, songTags.tagId))
        .groupBy(tags.id, tags.name)
        .orderBy(desc(sql`count(${songTags.songId})`));
      
      res.json(tagCloud);
    } catch (error) {
      console.error("Error fetching tag cloud:", error);
      res.status(500).json({ message: "Failed to fetch tag cloud" });
    }
  });

  app.post('/api/tags', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertTagSchema.parse({ name: req.body.name });
      
      // Check if tag exists
      const existing = await storage.getTagByName(validatedData.name);
      if (existing) {
        return res.json(existing);
      }
      
      const tag = await storage.createTag(validatedData);
      res.status(201).json(tag);
    } catch (error) {
      console.error("Error creating tag:", error);
      res.status(500).json({ message: "Failed to create tag" });
    }
  });

  // Get artists for a song
  app.get('/api/songs/:songId/artists', async (req, res) => {
    try {
      const artists = await storage.getSongArtists(req.params.songId);
      res.json(artists);
    } catch (error) {
      console.error("Error fetching song artists:", error);
      res.status(500).json({ message: "Failed to fetch artists" });
    }
  });

  // Link artist to song (collaborative metadata - any authenticated user can add)
  app.post('/api/songs/:songId/artists', isAuthenticated, async (req: any, res) => {
    try {
      if (!req.body.artistId || typeof req.body.artistId !== 'string') {
        return res.status(400).json({ message: "Invalid artistId" });
      }
      
      // Verify song exists
      const song = await storage.getSong(req.params.songId);
      if (!song) {
        return res.status(404).json({ message: "Song not found" });
      }
      
      await storage.addArtistToSong({
        songId: req.params.songId,
        artistId: req.body.artistId,
      });
      res.status(201).json({ message: "Artist linked to song" });
    } catch (error: any) {
      // Handle duplicate key errors gracefully
      if (error.message?.includes('duplicate') || error.code === '23505') {
        return res.json({ message: "Artist already linked to song" });
      }
      console.error("Error linking artist to song:", error);
      res.status(500).json({ message: "Failed to link artist to song" });
    }
  });

  // Remove artist from song
  app.delete('/api/songs/:songId/artists/:artistId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Verify song exists and user owns it
      const song = await storage.getSong(req.params.songId);
      if (!song) {
        return res.status(404).json({ message: "Song not found" });
      }
      
      if (song.addedBy !== userId) {
        return res.status(403).json({ message: "You can only modify songs you added" });
      }
      
      await storage.removeArtistFromSong(req.params.songId, req.params.artistId);
      res.json({ message: "Artist removed from song" });
    } catch (error) {
      console.error("Error removing artist from song:", error);
      res.status(500).json({ message: "Failed to remove artist from song" });
    }
  });

  // Get tags for a song
  app.get('/api/songs/:songId/tags', async (req, res) => {
    try {
      const songTags = await storage.getSongTags(req.params.songId);
      // Get the full tag objects
      const tags = await Promise.all(
        songTags.map(async (st) => {
          const tag = await storage.getTag(st.tagId);
          return tag;
        })
      );
      res.json(tags.filter(Boolean));
    } catch (error) {
      console.error("Error fetching song tags:", error);
      res.status(500).json({ message: "Failed to fetch tags" });
    }
  });

  // Link tag to song (collaborative metadata - any authenticated user can add)
  app.post('/api/songs/:songId/tags', isAuthenticated, async (req: any, res) => {
    try {
      if (!req.body.tagId || typeof req.body.tagId !== 'string') {
        return res.status(400).json({ message: "Invalid tagId" });
      }
      
      // Verify song exists
      const song = await storage.getSong(req.params.songId);
      if (!song) {
        return res.status(404).json({ message: "Song not found" });
      }
      
      await storage.addTagToSong({
        songId: req.params.songId,
        tagId: req.body.tagId,
      });
      res.status(201).json({ message: "Tag linked to song" });
    } catch (error: any) {
      // Handle duplicate key errors gracefully
      if (error.message?.includes('duplicate') || error.code === '23505') {
        return res.json({ message: "Tag already linked to song" });
      }
      console.error("Error linking tag to song:", error);
      res.status(500).json({ message: "Failed to link tag to song" });
    }
  });

  // Remove tag from song
  app.delete('/api/songs/:songId/tags/:tagId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Verify song exists and user owns it
      const song = await storage.getSong(req.params.songId);
      if (!song) {
        return res.status(404).json({ message: "Song not found" });
      }
      
      if (song.addedBy !== userId) {
        return res.status(403).json({ message: "You can only modify songs you added" });
      }
      
      await storage.removeTagFromSong(req.params.songId, req.params.tagId);
      res.json({ message: "Tag removed from song" });
    } catch (error) {
      console.error("Error removing tag from song:", error);
      res.status(500).json({ message: "Failed to remove tag from song" });
    }
  });

  // Album routes
  app.get('/api/albums/search', async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query || query.trim().length === 0) {
        return res.json([]);
      }
      const albums = await storage.searchAlbums(query);
      res.json(albums);
    } catch (error) {
      console.error("Error searching albums:", error);
      res.status(500).json({ message: "Failed to search albums" });
    }
  });

  app.post('/api/albums', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertAlbumSchema.parse({ name: req.body.name });
      const existing = await storage.getAlbumByName(validatedData.name);
      if (existing) {
        return res.json(existing);
      }
      const album = await storage.createAlbum(validatedData);
      res.status(201).json(album);
    } catch (error) {
      console.error("Error creating album:", error);
      res.status(500).json({ message: "Failed to create album" });
    }
  });

  // Language routes
  app.get('/api/languages/search', async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query || query.trim().length === 0) {
        return res.json([]);
      }
      const languages = await storage.searchLanguages(query);
      res.json(languages);
    } catch (error) {
      console.error("Error searching languages:", error);
      res.status(500).json({ message: "Failed to search languages" });
    }
  });

  app.post('/api/languages', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertLanguageSchema.parse({ name: req.body.name });
      const existing = await storage.getLanguageByName(validatedData.name);
      if (existing) {
        return res.json(existing);
      }
      const language = await storage.createLanguage(validatedData);
      res.status(201).json(language);
    } catch (error) {
      console.error("Error creating language:", error);
      res.status(500).json({ message: "Failed to create language" });
    }
  });

  // Artist routes
  app.get('/api/artists/search', async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query || query.trim().length === 0) {
        return res.json([]);
      }
      const artists = await storage.searchArtists(query);
      res.json(artists);
    } catch (error) {
      console.error("Error searching artists:", error);
      res.status(500).json({ message: "Failed to search artists" });
    }
  });

  app.post('/api/artists', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertArtistSchema.parse({ name: req.body.name });
      const existing = await storage.getArtistByName(validatedData.name);
      if (existing) {
        return res.json(existing);
      }
      const artist = await storage.createArtist(validatedData);
      res.status(201).json(artist);
    } catch (error) {
      console.error("Error creating artist:", error);
      res.status(500).json({ message: "Failed to create artist" });
    }
  });

  // Song of the day route
  app.get('/api/song-of-day', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Check if user already has a song for today
      const existing = await storage.getTodaysSongForUser(userId);
      if (existing) {
        const songWithPoster = await db
          .select({
            song: songs,
            poster: users,
          })
          .from(songs)
          .leftJoin(users, eq(songs.addedBy, users.id))
          .where(eq(songs.id, existing.songId))
          .limit(1);
        
        if (songWithPoster.length > 0) {
          return res.json(songWithPoster[0]);
        }
      }
      
      // Get all songs and pick a random one
      const allSongs = await storage.getAllSongs();
      if (allSongs.length === 0) {
        return res.status(404).json({ message: "No songs available" });
      }
      
      const randomSong = allSongs[Math.floor(Math.random() * allSongs.length)];
      
      // Assign it to the user
      await storage.createSongOfTheDay({
        userId,
        songId: randomSong.id,
        assignedDate: new Date(),
      });
      
      // Fetch the song with poster info
      const songWithPoster = await db
        .select({
          song: songs,
          poster: users,
        })
        .from(songs)
        .leftJoin(users, eq(songs.addedBy, users.id))
        .where(eq(songs.id, randomSong.id))
        .limit(1);
      
      res.json(songWithPoster[0] || { song: randomSong, poster: null });
    } catch (error) {
      console.error("Error fetching song of the day:", error);
      res.status(500).json({ message: "Failed to fetch song of the day" });
    }
  });

  // Feed route - shows recently liked songs
  app.get('/api/feed', async (req, res) => {
    try {
      // Get all reactions ordered by most recent with poster info
      const allReactions = await db
        .select({
          reaction: reactions,
          song: songs,
          user: users,
          poster: sql<typeof users.$inferSelect>`
            (SELECT row_to_json(u.*) FROM ${users} u WHERE u.id = ${songs.addedBy})
          `.as('poster'),
          story: songStories,
        })
        .from(reactions)
        .innerJoin(songs, eq(reactions.songId, songs.id))
        .innerJoin(users, eq(reactions.userId, users.id))
        .leftJoin(songStories, and(
          eq(songStories.songId, songs.id),
          eq(songStories.userId, users.id)
        ))
        .orderBy(desc(reactions.createdAt))
        .limit(20);
      
      res.json(allReactions);
    } catch (error) {
      console.error("Error fetching feed:", error);
      res.status(500).json({ message: "Failed to fetch feed" });
    }
  });

  // Discover/trending route - shows songs with most reactions
  app.get('/api/discover', async (req, res) => {
    try {
      // First get trending songs with reaction counts and poster info
      const trendingSongs = await db
        .select({
          song: songs,
          reactionCount: sql<number>`count(${reactions.id})::int`,
          poster: users,
        })
        .from(songs)
        .leftJoin(reactions, eq(songs.id, reactions.songId))
        .leftJoin(users, eq(songs.addedBy, users.id))
        .groupBy(songs.id, users.id)
        .orderBy(desc(sql`count(${reactions.id})`))
        .limit(50);
      
      // For each song, get one story (the first one)
      const songsWithStories = await Promise.all(
        trendingSongs.map(async (item) => {
          const story = await db
            .select()
            .from(songStories)
            .where(eq(songStories.songId, item.song.id))
            .limit(1);
          
          return {
            ...item,
            story: story[0] || null
          };
        })
      );
      
      res.json(songsWithStories);
    } catch (error) {
      console.error("Error fetching trending songs:", error);
      res.status(500).json({ message: "Failed to fetch trending songs" });
    }
  });

  // Development: Seed database endpoint
  app.post('/api/seed', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await seedDatabase(userId);
      res.json({ message: "Database seeded successfully" });
    } catch (error) {
      console.error("Error seeding database:", error);
      res.status(500).json({ message: "Failed to seed database" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
