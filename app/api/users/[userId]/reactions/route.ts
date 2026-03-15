import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reactions, songs, users } from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function GET(_req: Request, { params }: { params: { userId: string } }) {
  try {
    const reactionsWithSongs = await db
      .select({
        reaction: reactions,
        song: songs,
        poster: users,
        reactionCount: sql<number>`(SELECT COUNT(*) FROM reactions r WHERE r.song_id = ${songs.id})`,
      })
      .from(reactions)
      .innerJoin(songs, eq(reactions.songId, songs.id))
      .leftJoin(users, eq(songs.addedBy, users.id))
      .where(eq(reactions.userId, params.userId))
      .orderBy(desc(reactions.createdAt))
      .limit(50);

    return NextResponse.json(reactionsWithSongs);
  } catch {
    return NextResponse.json({ message: "Failed to fetch reactions" }, { status: 500 });
  }
}
