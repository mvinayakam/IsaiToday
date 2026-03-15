import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { storage } from "@/lib/storage";
import { insertPlaylistSchema } from "@shared/schema";

export async function GET() {
  const { userId, error } = await requireUser();
  if (error) return error;

  try {
    const playlists = await storage.getPlaylistsByUserId(userId!);
    return NextResponse.json(playlists);
  } catch {
    return NextResponse.json({ message: "Failed to fetch playlists" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId, error } = await requireUser();
  if (error) return error;

  try {
    const allSongs = await storage.getAllSongs();
    if (allSongs.length < 50) {
      return NextResponse.json(
        { message: "Playlist creation requires at least 50 songs in the database", songCount: allSongs.length, required: 50 },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validatedData = insertPlaylistSchema.parse({ userId, title: body.title });
    const playlist = await storage.createPlaylist(validatedData);
    return NextResponse.json(playlist, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Failed to create playlist" }, { status: 500 });
  }
}
