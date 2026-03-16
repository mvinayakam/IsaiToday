import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { storage } from "@/lib/storage";
import { db } from "@/lib/db";
import { songs, users, songStories } from "@shared/schema";
import { eq } from "drizzle-orm";

async function getSongWithPoster(songId: string) {
  const result = await db
    .select({ song: songs, poster: users })
    .from(songs)
    .leftJoin(users, eq(songs.addedBy, users.id))
    .where(eq(songs.id, songId))
    .limit(1);
  if (!result[0]) return null;

  // Include the poster's story for this song if one exists
  const storyResult = await db
    .select()
    .from(songStories)
    .where(eq(songStories.songId, songId))
    .limit(1);

  return { ...result[0], story: storyResult[0] ?? null };
}

export async function GET() {
  try {
    const allSongs = await storage.getAllSongs();
    if (allSongs.length === 0) return NextResponse.json({ message: "No songs available" }, { status: 404 });

    const session = await getServerSession(authOptions);

    // Authenticated: per-user daily song with tracking
    if (session?.user?.id) {
      const userId = session.user.id;
      const existing = await storage.getTodaysSongForUser(userId);
      if (existing) {
        const data = await getSongWithPoster(existing.songId);
        if (data) return NextResponse.json(data);
      }
      const randomSong = allSongs[Math.floor(Math.random() * allSongs.length)];
      await storage.createSongOfTheDay({ userId, songId: randomSong.id, assignedDate: new Date() });
      const data = await getSongWithPoster(randomSong.id);
      return NextResponse.json(data ?? { song: randomSong, poster: null });
    }

    // Guest: just return a random song, no tracking
    const randomSong = allSongs[Math.floor(Math.random() * allSongs.length)];
    const data = await getSongWithPoster(randomSong.id);
    return NextResponse.json(data ?? { song: randomSong, poster: null });
  } catch {
    return NextResponse.json({ message: "Failed to fetch song of the day" }, { status: 500 });
  }
}
