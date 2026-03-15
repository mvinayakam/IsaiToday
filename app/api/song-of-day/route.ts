import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { storage } from "@/lib/storage";
import { db } from "@/lib/db";
import { songs, users } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const { userId, error } = await requireUser();
  if (error) return error;

  try {
    const existing = await storage.getTodaysSongForUser(userId!);
    if (existing) {
      const songWithPoster = await db
        .select({ song: songs, poster: users })
        .from(songs)
        .leftJoin(users, eq(songs.addedBy, users.id))
        .where(eq(songs.id, existing.songId))
        .limit(1);

      if (songWithPoster.length > 0) return NextResponse.json(songWithPoster[0]);
    }

    const allSongs = await storage.getAllSongs();
    if (allSongs.length === 0) return NextResponse.json({ message: "No songs available" }, { status: 404 });

    const randomSong = allSongs[Math.floor(Math.random() * allSongs.length)];
    await storage.createSongOfTheDay({ userId: userId!, songId: randomSong.id, assignedDate: new Date() });

    const songWithPoster = await db
      .select({ song: songs, poster: users })
      .from(songs)
      .leftJoin(users, eq(songs.addedBy, users.id))
      .where(eq(songs.id, randomSong.id))
      .limit(1);

    return NextResponse.json(songWithPoster[0] || { song: randomSong, poster: null });
  } catch {
    return NextResponse.json({ message: "Failed to fetch song of the day" }, { status: 500 });
  }
}
