import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reactions, songs, users, songStories } from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function GET() {
  try {
    const trendingSongs = await db
      .select({
        song: songs,
        reactionCount: sql<number>`count(${reactions.id})`,
        poster: users,
      })
      .from(songs)
      .leftJoin(reactions, eq(songs.id, reactions.songId))
      .leftJoin(users, eq(songs.addedBy, users.id))
      .groupBy(songs.id, users.id)
      .orderBy(desc(sql`count(${reactions.id})`))
      .limit(50);

    const songsWithStories = await Promise.all(
      trendingSongs.map(async (item) => {
        const [story] = await db
          .select()
          .from(songStories)
          .where(eq(songStories.songId, item.song.id))
          .limit(1);
        return { ...item, story: story ?? null };
      })
    );

    return NextResponse.json(songsWithStories);
  } catch {
    return NextResponse.json({ message: "Failed to fetch trending songs" }, { status: 500 });
  }
}
