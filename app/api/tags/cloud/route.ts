import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tags, songTags } from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function GET() {
  try {
    const tagCloud = await db
      .select({
        id: tags.id,
        name: tags.name,
        count: sql<number>`count(${songTags.songId})`,
      })
      .from(tags)
      .leftJoin(songTags, eq(tags.id, songTags.tagId))
      .groupBy(tags.id, tags.name)
      .orderBy(desc(sql`count(${songTags.songId})`));

    return NextResponse.json(tagCloud);
  } catch {
    return NextResponse.json({ message: "Failed to fetch tag cloud" }, { status: 500 });
  }
}
