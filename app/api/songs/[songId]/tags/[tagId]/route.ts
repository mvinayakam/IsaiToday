import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { storage } from "@/lib/storage";

export async function DELETE(_req: Request, { params }: { params: { songId: string; tagId: string } }) {
  const { userId, error } = await requireUser();
  if (error) return error;

  try {
    const song = await storage.getSong(params.songId);
    if (!song) return NextResponse.json({ message: "Song not found" }, { status: 404 });
    if (song.addedBy !== userId) return NextResponse.json({ message: "You can only modify songs you added" }, { status: 403 });

    await storage.removeTagFromSong(params.songId, params.tagId);
    return NextResponse.json({ message: "Tag removed from song" });
  } catch {
    return NextResponse.json({ message: "Failed to remove tag from song" }, { status: 500 });
  }
}
