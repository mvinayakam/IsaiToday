import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reactions, songs, users, songStories } from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

export async function GET() {
  try {
    const allReactions = await db
      .select({
        reaction: reactions,
        song: songs,
        user: users,
        story: songStories,
      })
      .from(reactions)
      .innerJoin(songs, eq(reactions.songId, songs.id))
      .innerJoin(users, eq(reactions.userId, users.id))
      .leftJoin(
        songStories,
        and(eq(songStories.songId, songs.id), eq(songStories.userId, users.id))
      )
      .orderBy(desc(reactions.createdAt))
      .limit(20);

    // Attach poster separately (song's addedBy user)
    const result = await Promise.all(
      allReactions.map(async (item) => {
        const [poster] = await db
          .select()
          .from(users)
          .where(eq(users.id, item.song.addedBy ?? ""))
          .limit(1);
        return { ...item, poster: poster ?? null };
      })
    );

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ message: "Failed to fetch feed" }, { status: 500 });
  }
}
