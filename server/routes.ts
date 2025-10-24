import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertSongSchema, insertSongStorySchema, insertReactionSchema, insertPlaylistSchema, insertPlaylistSongSchema, insertTagSchema, songs, reactions, users } from "@shared/schema";
import { seedDatabase } from "./seed";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

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
      const validatedData = insertSongSchema.parse({
        ...req.body,
        addedBy: userId,
      });
      
      // Check if song already exists
      const existing = await storage.getSongByYoutubeId(validatedData.youtubeId);
      if (existing) {
        return res.json(existing);
      }
      
      const song = await storage.createSong(validatedData);
      res.status(201).json(song);
    } catch (error) {
      console.error("Error creating song:", error);
      res.status(500).json({ message: "Failed to create song" });
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
      // Get reactions with full song details, including reaction counts
      const reactionsWithSongs = await db
        .select({
          reaction: reactions,
          song: songs,
          reactionCount: sql<number>`(
            SELECT COUNT(*) FROM ${reactions} r 
            WHERE r.song_id = ${songs.id}
          )::int`,
        })
        .from(reactions)
        .innerJoin(songs, eq(reactions.songId, songs.id))
        .where(eq(reactions.userId, req.params.userId))
        .orderBy(desc(reactions.createdAt))
        .limit(50);
      
      res.json(reactionsWithSongs);
    } catch (error) {
      console.error("Error fetching user reactions:", error);
      res.status(500).json({ message: "Failed to fetch reactions" });
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

  // Song of the day route
  app.get('/api/song-of-day', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Check if user already has a song for today
      const existing = await storage.getTodaysSongForUser(userId);
      if (existing) {
        const song = await storage.getSong(existing.songId);
        return res.json(song);
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
      
      res.json(randomSong);
    } catch (error) {
      console.error("Error fetching song of the day:", error);
      res.status(500).json({ message: "Failed to fetch song of the day" });
    }
  });

  // Feed route - shows recently liked songs
  app.get('/api/feed', async (req, res) => {
    try {
      // Get all reactions ordered by most recent
      const allReactions = await db
        .select({
          reaction: reactions,
          song: songs,
          user: users,
        })
        .from(reactions)
        .innerJoin(songs, eq(reactions.songId, songs.id))
        .innerJoin(users, eq(reactions.userId, users.id))
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
      const trendingSongs = await db
        .select({
          song: songs,
          reactionCount: sql<number>`count(${reactions.id})::int`,
        })
        .from(songs)
        .leftJoin(reactions, eq(songs.id, reactions.songId))
        .groupBy(songs.id)
        .orderBy(desc(sql`count(${reactions.id})`))
        .limit(50);
      
      res.json(trendingSongs);
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
