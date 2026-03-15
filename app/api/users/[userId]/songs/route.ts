import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { songs, reactions } from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function GET(_req: Request, { params }: { params: { userId: string } }) {
  try {
    const userSongs = await db
      .select({
        song: songs,
        reactionCount: sql<number>`count(${reactions.id})`,
      })
      .from(songs)
      .leftJoin(reactions, eq(songs.id, reactions.songId))
      .where(eq(songs.addedBy, params.userId))
      .groupBy(songs.id)
      .orderBy(desc(songs.createdAt))
      .limit(50);

    return NextResponse.json(userSongs);
  } catch {
    return NextResponse.json({ message: "Failed to fetch user songs" }, { status: 500 });
  }
}
